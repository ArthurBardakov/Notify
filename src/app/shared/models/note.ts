export class Note {
  constructor(
    public id: string,
    public title: string | null,
    public content: string | null,
    public createdAt: Date,
    public updatedAt: Date | null = null,
  ) {}
}
