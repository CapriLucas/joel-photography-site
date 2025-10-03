import photo from './photo'
import collection from './collection'
import siteSettings from './siteSettings'
import homePage from './homePage'
import explorePage from './explorePage'
import navigation from './navigation'
import footer from './footer'

export const schemaTypes = [
  // Content schemas
  photo,
  collection,

  // Site configuration schemas
  siteSettings,
  homePage,
  explorePage,
  navigation,
  footer
]