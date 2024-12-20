import { GetCapchaImageSourcePipe } from './forgot-password-pipes.pipe';

describe('GetCapchaImageSourcePipe', () => {
  it('create an instance', () => {
    const pipe = new GetCapchaImageSourcePipe();
    expect(pipe).toBeTruthy();
  });
});
