import {
  COOKIE_NAME,
  getStoredLastSeen,
  saveLastSeen,
  createProgressSnapshot,
  hasProgressChanged,
} from '../utils';

const USERNAME = 'openedx';

beforeEach(() => {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.trim().split('=')[0];
    document.cookie = `${name}=; max-age=0; path=/`;
  });
});

describe('getStoredLastSeen', () => {
  it('returns parsed snapshot when cookie exists', () => {
    const snapshot = { currentPoints: 50, stage: 2 };
    document.cookie = `${COOKIE_NAME}-${USERNAME}=${JSON.stringify(snapshot)}; path=/`;

    expect(getStoredLastSeen(USERNAME)).toEqual(snapshot);
  });

  it('returns null when no cookie exists', () => {
    expect(getStoredLastSeen(USERNAME)).toBeNull();
  });

  it('returns null when cookie exists for a different user', () => {
    const snapshot = { currentPoints: 50, stage: 2 };
    document.cookie = `${COOKIE_NAME}-otheruser=${JSON.stringify(snapshot)}; path=/`;

    expect(getStoredLastSeen(USERNAME)).toBeNull();
  });

  it('returns null when cookie value is malformed JSON', () => {
    document.cookie = `${COOKIE_NAME}-${USERNAME}=not-json; path=/`;

    expect(getStoredLastSeen(USERNAME)).toBeNull();
  });

  it('handles cookie value containing equals signs', () => {
    const snapshot = { currentPoints: 10, stage: 1 };
    const value = JSON.stringify(snapshot);
    document.cookie = `${COOKIE_NAME}-${USERNAME}=${value}; path=/`;

    expect(getStoredLastSeen(USERNAME)).toEqual(snapshot);
  });
});

describe('saveLastSeen', () => {
  it('writes a cookie with the correct name and value', () => {
    const spy = jest.spyOn(document, 'cookie', 'set');
    const snapshot = { currentPoints: 100, stage: 3 };

    saveLastSeen(USERNAME, snapshot);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`${COOKIE_NAME}-${USERNAME}=${JSON.stringify(snapshot)}`),
    );

    spy.mockRestore();
  });

  it('includes the domain from LMS_BASE_URL', () => {
    const spy = jest.spyOn(document, 'cookie', 'set');
    const snapshot = { currentPoints: 10, stage: 1 };

    saveLastSeen(USERNAME, snapshot);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('domain=example.com'),
    );

    spy.mockRestore();
  });

  it('includes max-age of one year', () => {
    const spy = jest.spyOn(document, 'cookie', 'set');
    const snapshot = { currentPoints: 10, stage: 1 };
    const oneYear = 365 * 24 * 60 * 60;

    saveLastSeen(USERNAME, snapshot);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`max-age=${oneYear}`),
    );

    spy.mockRestore();
  });

  it('includes SameSite=Lax', () => {
    const spy = jest.spyOn(document, 'cookie', 'set');
    const snapshot = { currentPoints: 10, stage: 1 };

    saveLastSeen(USERNAME, snapshot);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('SameSite=Lax'),
    );

    spy.mockRestore();
  });

  it('does not throw when cookies are unavailable', () => {
    const spy = jest.spyOn(document, 'cookie', 'set').mockImplementation(() => {
      throw new Error('Cookies disabled');
    });

    try {
      expect(() => saveLastSeen(USERNAME, { currentPoints: 0, stage: null })).not.toThrow();
    } finally {
      spy.mockRestore();
    }
  });
});

describe('createProgressSnapshot', () => {
  it('creates snapshot from full API data', () => {
    const data = {
      current_points: 75,
      current_avatar: { stage: 3, image: 'avatar.png' },
    };

    expect(createProgressSnapshot(data)).toEqual({
      currentPoints: 75,
      stage: 3,
    });
  });

  it('defaults currentPoints to 0 when current_points is undefined', () => {
    const data = {
      current_avatar: { stage: 1 },
    };

    expect(createProgressSnapshot(data)).toEqual({
      currentPoints: 0,
      stage: 1,
    });
  });

  it('defaults stage to null when current_avatar is undefined', () => {
    const data = {
      current_points: 50,
    };

    expect(createProgressSnapshot(data)).toEqual({
      currentPoints: 50,
      stage: null,
    });
  });

  it('defaults stage to null when current_avatar is null', () => {
    const data = {
      current_points: 50,
      current_avatar: null,
    };

    expect(createProgressSnapshot(data)).toEqual({
      currentPoints: 50,
      stage: null,
    });
  });
});

describe('hasProgressChanged', () => {
  it('returns false when snapshots are identical', () => {
    const a = { currentPoints: 50, stage: 2 };
    const b = { currentPoints: 50, stage: 2 };

    expect(hasProgressChanged(a, b)).toBe(false);
  });

  it('returns true when currentPoints differ', () => {
    const a = { currentPoints: 50, stage: 2 };
    const b = { currentPoints: 75, stage: 2 };

    expect(hasProgressChanged(a, b)).toBe(true);
  });

  it('returns true when stage differs', () => {
    const a = { currentPoints: 50, stage: 2 };
    const b = { currentPoints: 50, stage: 3 };

    expect(hasProgressChanged(a, b)).toBe(true);
  });

  it('returns true when both fields differ', () => {
    const a = { currentPoints: 50, stage: 2 };
    const b = { currentPoints: 100, stage: 4 };

    expect(hasProgressChanged(a, b)).toBe(true);
  });

  it('treats null and number stage as different', () => {
    const a = { currentPoints: 50, stage: null };
    const b = { currentPoints: 50, stage: 1 };

    expect(hasProgressChanged(a, b)).toBe(true);
  });
});
