export interface ICommand {
  title: string;
  command: string;
  category: string;
}

export interface IConfiguration {
  type: string;
  title: string;
  properties: any;
}

export interface ISettings {
  hideComments: boolean;
  environmentKeys: string;
  environmentComments: string;
  files: string[]
}
