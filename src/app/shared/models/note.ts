export class Note {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date | null = null,
  ) {}
}
