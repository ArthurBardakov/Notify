export class Note {
  constructor(
    public id: string,
    public title: string | undefined,
    public content: string | undefined,
    public createdAt: Date,
    public updatedAt: Date | undefined = undefined,
    public deletedAt: Date | undefined = undefined
  ) {}
}
