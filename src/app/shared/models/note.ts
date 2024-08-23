import { CssVariables } from "../css-variable-helper";

export class Note {
  constructor(
    public id: string,
    public title = '',
    public content = '',
    public hexColor: string = CssVariables.primaryColor,
    public createdAt: Date = new Date(),
    public updatedAt: Date | undefined = undefined,
    public deletedAt: Date | undefined = undefined,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.hexColor = hexColor;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
