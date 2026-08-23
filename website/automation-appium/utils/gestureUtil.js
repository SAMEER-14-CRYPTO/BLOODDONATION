class GestureUtil {
  constructor(driver) {
    this.driver = driver;
  }

  async swipe(fromX, fromY, toX, toY, duration = 800) {
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: fromX, y: fromY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: duration, x: toX, y: toY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  async scrollDown() {
    const { width, height } = await this.driver.getWindowRect();
    await this.swipe(Math.floor(width / 2), Math.floor(height * 0.8), Math.floor(width / 2), Math.floor(height * 0.2));
  }

  async scrollUp() {
    const { width, height } = await this.driver.getWindowRect();
    await this.swipe(Math.floor(width / 2), Math.floor(height * 0.2), Math.floor(width / 2), Math.floor(height * 0.8));
  }

  async tapByCoordinates(x, y) {
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 50 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}

module.exports = GestureUtil;
