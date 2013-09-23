var VALID_TRANSLATORS = ['app', 'model', 'collection', 'view', 'controller'],
    VALID_LANGS = ['coffeescript'],
    VALID_SUFXS = ['coffee'];

function isValidLang (lang) {
  return !~VALID_LANGS.indexOf(lang) ? false : true;
}

function getLangSuffix (lang) {
  var idx = VALID_LANGS.indexOf(lang);
  return VALID_SUFXS[idx];
}

function translate (lang) {
  if ( !isValidLang(lang) ) return new Error('translator.' + lang, 'is not a valid rendr translator');
  var suffix = getLangSuffix(lang),
      translator;

  VALID_TRANSLATORS.forEach( function( name ) {
    translator = new require('.' + name + '/' + lang + '/' + name + '_translator')(lang, suffix, name);
    translator.clearTranslation().translate();
  });
}

translate(process.argv[2]);