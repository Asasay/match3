import Game from "./Game";

abstract class State {
  protected game;
  protected board;

  constructor(game: Game) {
    this.game = game;
    this.board = game.board;
  }
  abstract loop(delta: number): void;
}

class IdleState extends State {
  loop(): void {
    console.log("IdleState");
    if (this.board.selectedGem && this.board.targetGem) {
      this.board.interactive = false;
      this.game.changeState(new MoveState(this.game));
    }
  }
}

class MoveState extends State {
  loop(delta: number): void {
    console.log("MoveState");
    const selectedGem = this.board.selectedGem!;
    const targetGem = this.board.targetGem!;
    if (!selectedGem.inPlace() || !targetGem.inPlace()) {
      selectedGem.moveToNewPos(this.game.speed * delta);
      targetGem.moveToNewPos(this.game.speed * delta);
    } else if (this.board.swapped) this.game.changeState(new ComboState(this.game));
    else {
      this.game.changeState(new IdleState(this.game));
      this.board.interactive = true;
      this.board.selectedGem = null;
      this.board.targetGem = null;
    }
  }
}

class ComboState extends State {
  loop(): void {
    console.log("ComboState");
    const gemsForDeletion = this.board.clear();
    if (gemsForDeletion.length > 0) {
      this.board.selectedGem = null;
      this.board.targetGem = null;
      gemsForDeletion.forEach((gem) => {
        gem.explode();
        this.board.removeGem(gem);
      });
      this.board.rearrange();
      this.game.stop(600);
      this.game.changeState(new RearrangeState(this.game));
      return;
    } else if (this.board.selectedGem && this.board.targetGem) {
      this.board.swap(this.board.selectedGem, this.board.targetGem);
      this.game.changeState(new MoveState(this.game));
      return;
    } else {
      this.board.interactive = true;
      this.board.swapped = false;
      this.game.changeState(new IdleState(this.game));
    }
  }
}

class RearrangeState extends State {
  loop(delta: number): void {
    console.log("RearrangeState");
    let gemsInPlace = true;
    this.board.gems.forEach((row) =>
      row.forEach((gem) => {
        if (gem === null) return null;
        if (!gem.inPlace()) {
          gemsInPlace = false;
          gem.moveToNewPos(this.game.speed * delta);
          return gem;
        }
      })
    );
    if (gemsInPlace) this.game.changeState(new ComboState(this.game));
  }
}

export { State, IdleState, MoveState, ComboState, RearrangeState };
