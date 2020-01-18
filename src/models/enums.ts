export enum Commands {
  hideSecrets = 'cloak.hideSecrets',
  showSecrets = 'cloak.showSecrets',
  toggleSecrets = 'cloak.toggleSecrets',
  restoreDefaultScopes = 'cloak.restoreDefaultScopes'
}

export enum Settings {
  HideComments = 'hideComments',
  EnvironmentKeys = 'environmentKeys',
  EnvironmentComments = 'environmentComments'
}

export enum Sections {
  cloakSection = 'cloak',
  editorTokenColorCustomizationSection = 'editor.tokenColorCustomizations'
}

export enum TextMateRulesNames {
  envKeys = 'envKeys',
  envComments = 'envComments'
}

export enum TextMateScopeDefaults {
  envKeys = 'string.quoted.double.env,source.env,constant.numeric.env',
  envComments = 'comment.line.number-sign.env'
}
