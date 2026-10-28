-- Rich-text exports can leave U+FFFC (OBJECT REPLACEMENT CHARACTER) beside
-- inline Markdown. It has no semantic meaning in post content and renders as
-- a visible replacement glyph in browsers.
update public.posts
set body = replace(body, U&'\FFFC', '')
where position(U&'\FFFC' in body) > 0;
