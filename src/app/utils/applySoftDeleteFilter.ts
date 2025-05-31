// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applySoftDeleteFilter(this: any) {
  this.where({
    isDeleted: { $ne: true },
    status: { $ne: 'blocked' }
  });
}
