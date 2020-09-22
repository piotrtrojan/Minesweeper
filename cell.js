class Cell {
  static get mineImage() {
    return loadImage('images/bomb.png')
  };
  static get mineExplosionImage() {
    return loadImage('images/bombExplosion.png')
  };
  static get mineMarkerImage() {
    return loadImage('images/mine_marker.png')
  };

  constructor(x, y, size, mineChance) {
    this.revealed = false;
    this.neighborCounter = 0;
    this.x = x;
    this.y = y;
    this.size = size;
    this.mine = random(1) < mineChance;

    this.failedMine = false;
    this.questionMark = false;
    this.mineMarked = false;
  }

  show() {
    stroke(0);
    fill(this.revealed ? 255 : 200);
    rect(this.x, this.y, this.size);
    noFill();
    if (!this.revealed) {
      if (this.questionMark) {
        this.writeText('?');
      } else if (this.mineMarked) {
        // image(Cell.mineMarkerImage, this.x, this.y);
        this.writeText('#');
      }
    } else {
      if (this.failedMine) {
        fill(154, 3, 30);
        ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size * 0.6);
      } else if (this.mine) {
        if (this.mineMarked) {
          fill(6, 214, 160);
        } else {
          fill(251, 139, 36);
          ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size * 0.6);
        }
      } else if (this.neighborCounter > 0) {
        this.writeText(this.neighborCounter)
      }
      if (this.mineMarked && !this.mine) {
        this.writeText('X', 'red')
      }
    }
  }

  writeText(message, color = 0) {
    fill(color);
    textSize(Math.floor(this.size * 0.8));
    text(message, this.x + (this.size * 0.3), this.y + (this.size * 0.8));
  }

  setNeighbor(neighborCount) {
    this.neighborCounter = neighborCount;
  }

  reveal(auto = false) {
    if (this.mineMarked)
      return false
    this.revealed = true;
    this.questionMark = false;
    if (!auto && this.mine)
      this.failedMine = true;
    return true;
  }

  toggleMark() {
    if (this.revealed)
      return;
    if (this.mineMarked) {
      this.mineMarked = false;
      this.questionMark = true;
    } else if (this.questionMark) {
      this.mineMarked = false;;
      this.questionMark = false;
    } else {
      this.mineMarked = true;
    }
  }
}