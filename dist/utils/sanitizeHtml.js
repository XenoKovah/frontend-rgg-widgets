"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeDescriptionHtml = exports.default = void 0;
var _dompurify = _interopRequireDefault(require("dompurify"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Sanitize a staff-authored badge description for rendering as HTML.
 *
 * Badge descriptions are authored by staff in the Gamma admin and may contain a
 * simple hyperlink -- e.g. a "Course Completion" badge whose description links the
 * course name to its class page. They are rendered via dangerouslySetInnerHTML, so
 * we sanitize first: allow only inline formatting and anchors, drop everything else
 * (scripts, event handlers, javascript: URLs are removed by DOMPurify), and force
 * every link to open in a new tab with a safe rel. Plain-text descriptions pass
 * through unchanged.
 */
const ALLOWED_TAGS = ['a', 'b', 'strong', 'i', 'em', 'br', 'span'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];
let anchorHookRegistered = false;
const ensureAnchorHook = () => {
  if (anchorHookRegistered || typeof _dompurify.default.addHook !== 'function') {
    return;
  }
  _dompurify.default.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  anchorHookRegistered = true;
};
const sanitizeDescriptionHtml = html => {
  ensureAnchorHook();
  return _dompurify.default.sanitize(html || '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR
  });
};
exports.sanitizeDescriptionHtml = sanitizeDescriptionHtml;
var _default = exports.default = sanitizeDescriptionHtml;
//# sourceMappingURL=sanitizeHtml.js.map