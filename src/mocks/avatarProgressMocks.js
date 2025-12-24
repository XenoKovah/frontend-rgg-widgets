export const mockAvatarNotFoundError = {
  error: 'http_error',
  status: 404,
  detail: {
    error: 'UserAvatarConfig not found for user: `test257`',
  },
};

export const mockNoAvatarSelected = {
  current_points: 0,
  required_points: 50,
  max_required_points: 200,
  current_avatar: null,
  next_avatar: {
    id: 1,
    title: 'Level 1',
    stage: 1,
    image: 'http://example.com/avatars/lvl1.svg',
    description: 'Some description',
  },
};

export const mockAvatarProgress = {
  current_points: 60,
  required_points: 100,
  max_required_points: 200,
  current_avatar: {
    id: 1,
    title: 'Level 1',
    stage: 1,
    image: 'http://example.com/avatars/lvl1.svg',
    description: 'Some description',
  },
  next_avatar: {
    id: 2,
    title: 'Level 2',
    stage: 2,
    image: 'http://example.com/avatars/lvl2.svg',
    description: 'Some description',
  },
};

export const mockFullyDevelopedAvatar = {
  current_points: 210,
  required_points: 0,
  max_required_points: 200,
  current_avatar: {
    id: 4,
    title: 'Level 4',
    stage: 4,
    image: 'http://example.com/avatars/lvl4.svg',
    description: 'Some description',
  },
  next_avatar: null,
};
