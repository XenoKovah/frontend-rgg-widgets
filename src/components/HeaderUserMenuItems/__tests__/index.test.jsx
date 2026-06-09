import React from 'react';
import { render, screen } from '@testing-library/react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { createTestWrapper } from '../../../setupTest';
import messages from '../messages';
import { HeaderUserMenuItems, LearningHeaderUserMenuItems } from '..';

const wrapper = createTestWrapper(messages);

// eslint-disable-next-line react/prop-types
const WidgetMutatorRunner = ({ mutate, widget }) => {
  const updated = mutate(widget);
  // Only expose the bits we care about in assertions.
  return (
    <div>
      <div data-testid="menu">{JSON.stringify(updated.content.menu || null)}</div>
      <div data-testid="items">{JSON.stringify(updated.content.items || null)}</div>
    </div>
  );
};

describe('HeaderUserMenuItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getConfig.mockReturnValue({
      LMS_BASE_URL: 'https://example.com',
      GAMMA_SETTINGS_URL: 'https://example.com/gamma_settings/',
    });
    getAuthenticatedUser.mockReturnValue({ username: 'openedx', administrator: false });
  });

  it('prepends Your Badges + Leaderboard items to legacy header menu', () => {
    const widget = {
      content: { menu: [] },
      RenderWidget: { props: { menu: [{ items: [{ type: 'item', href: '/existing', content: 'Existing' }] }] } },
    };

    render(<WidgetMutatorRunner mutate={HeaderUserMenuItems} widget={widget} />, { wrapper });

    const menu = JSON.parse(screen.getByTestId('menu').textContent);

    expect(menu).toHaveLength(2);
    expect(menu[0].items).toEqual([
      {
        type: 'item',
        href: 'https://example.com/gamma_dashboard/dashboard/',
        content: 'Your Badges',
      },
      {
        type: 'item',
        href: 'https://example.com/gamma_dashboard/leaderboard/',
        content: 'Leaderboard',
      },
    ]);
    expect(menu[1].items[0]).toEqual({ type: 'item', href: '/existing', content: 'Existing' });
  });

  it('adds Gamification Settings item for administrators (legacy header menu)', () => {
    getAuthenticatedUser.mockReturnValue({ username: 'openedx', administrator: true });

    const widget = {
      content: { menu: [] },
      RenderWidget: { props: { menu: [] } },
    };

    render(<WidgetMutatorRunner mutate={HeaderUserMenuItems} widget={widget} />, { wrapper });

    const menu = JSON.parse(screen.getByTestId('menu').textContent);
    expect(menu[0].items).toEqual([
      {
        type: 'item',
        href: 'https://example.com/gamma_dashboard/dashboard/',
        content: 'Your Badges',
      },
      {
        type: 'item',
        href: 'https://example.com/gamma_dashboard/leaderboard/',
        content: 'Leaderboard',
      },
      {
        type: 'item',
        href: 'https://example.com/gamma_settings/',
        content: 'Gamification Settings',
      },
    ]);
  });
});

describe('LearningHeaderUserMenuItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getConfig.mockReturnValue({
      LMS_BASE_URL: 'https://example.com',
      GAMMA_SETTINGS_URL: 'https://example.com/gamma_settings/',
    });
    getAuthenticatedUser.mockReturnValue({ username: 'openedx', administrator: false });
  });

  it('prepends Your Badges + Leaderboard items to learning header items', () => {
    const widget = {
      content: { items: [] },
      RenderWidget: { props: { items: [{ href: '/existing', content: 'Existing' }] } },
    };

    render(<WidgetMutatorRunner mutate={LearningHeaderUserMenuItems} widget={widget} />, { wrapper });

    const items = JSON.parse(screen.getByTestId('items').textContent);
    expect(items).toEqual([
      { href: 'https://example.com/gamma_dashboard/dashboard/', content: 'Your Badges', message: 'Your Badges' },
      { href: 'https://example.com/gamma_dashboard/leaderboard/', content: 'Leaderboard', message: 'Leaderboard' },
      { href: '/existing', content: 'Existing' },
    ]);
  });

  it('adds Gamification Settings item for administrators (learning header items)', () => {
    getAuthenticatedUser.mockReturnValue({ username: 'openedx', administrator: true });

    const widget = {
      content: { items: [] },
      RenderWidget: { props: { items: [] } },
    };

    render(<WidgetMutatorRunner mutate={LearningHeaderUserMenuItems} widget={widget} />, { wrapper });

    const items = JSON.parse(screen.getByTestId('items').textContent);
    expect(items).toEqual([
      { href: 'https://example.com/gamma_dashboard/dashboard/', content: 'Your Badges', message: 'Your Badges' },
      { href: 'https://example.com/gamma_dashboard/leaderboard/', content: 'Leaderboard', message: 'Leaderboard' },
      { href: 'https://example.com/gamma_settings/', content: 'Gamification Settings', message: 'Gamification Settings' },
    ]);
  });
});
