export abstract class CommonResponseDto {
  protected EXCLUDE: string[] = [];

  protected assign<T extends CommonResponseDto>(src: Partial<T>, dst: T) {
    for (const k in src || {}) {
      if (this.EXCLUDE.includes(k)) continue;
      dst[k] = src[k];
    }
  }
}
