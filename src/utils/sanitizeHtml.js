import DOMPurify from 'dompurify';

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
  if (anchorHookRegistered || typeof DOMPurify.addHook !== 'function') {
    return;
  }
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  anchorHookRegistered = true;
};

export const sanitizeDescriptionHtml = (html) => {
  ensureAnchorHook();
  return DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR });
};

export default sanitizeDescriptionHtml;
