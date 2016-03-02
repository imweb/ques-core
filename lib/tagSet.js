
'use strict';

var BLOCK = [
        'body article aside details figcaption figure footer header hgroup',
        'address article aside blockquote center dir div dd details dl dt',
        'fieldset figcaption figure form frameset h1 h2 h3 h4 h5 h6',
        'hr header hgroup isindex menu nav noframes noscript ol p pre section',
        'head link meta title html ul li menu nav section summary'
    ].join(' '),
    INLINE = [
       'a abbr acronym audio b basefont bdo big br canvas cite code',
       'command datalist dfn em embed font i img input keygen kbd label',
       'mark meter output progress q rp rt ruby s samp select small span',
       'strike strong sub sup textarea time tt u var video wbr button'
    ].join(' '),
    RESERVE = ['root'],
    ALL = [BLOCK, INLINE, RESERVE].join(' ').split(/\s+/).map(function(item) {
        return item.trim();
    }),
    tagSet = new Set(ALL);

tagSet.isCustom = function(item) {
    return !this.has(item);
};

module.exports = tagSet;

