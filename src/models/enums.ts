export enum Commands {
  hideSecrets = 'hideSecrets.hideSecrets',
  showSecrets = 'hideSecrets.showSecrets',
  toggleSecrets = 'hideSecrets.toggleSecrets'
}

export enum Settings {
  EnvironmentKeys = 'environmentKeys',
  EnvironmentComments = 'environmentComments'
}

export enum Sections {
  hideSecretsSection = 'hideSecrets',
  editorTokenColorCustomizationSection = 'editor.tokenColorCustomizations'
}

export enum TextMateRulesNames {
  envKeys = 'envKeys',
  envComments = 'envComments'
}

// export enum TextMateScopes {
//   envKeys = 'string.quoted.double.env,source.env,constant.numeric.env',
//   envComments = 'comment.line.number-sign.env'
// }
