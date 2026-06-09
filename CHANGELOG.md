# Changelog

## [Unreleased]

## Added
- [NAU-591] create widgets: HeaderUserMenuItems and LearningHeaderUserMenuItems
- Add `ProfileBadges` widget that lists a user's earned badges (name + description) on the profile page

## Changed
- Rename the "Performance" item in the user dropdown menu to "Your Badges" (HeaderUserMenuItems + LearningHeaderUserMenuItems); the i18n id and the link target (the Performance dashboard) are unchanged.

## Fixed
- Correct the LearningHeaderUserMenuItems tests to assert the `message` field added in [OST-68] (they were failing on the base branch)
- [OST-68] add message field to LearningHeader user menu items
- [NAU-591] correct gamma profile API url
