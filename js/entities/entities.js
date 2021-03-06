const texts = {
  sk1: [
    'Ах, какой вчера концерт был! Сказка, просто сказка. Сто лет никуда не ходила, даже гулять почти перестала. Пошла — и сразу какая красота!',
    'Надо расшевелить себя немного. Пойду я на улицу выскочу. Ха, выскочу, конечно! Скакунья. Ноги-то болят совсем сильно. Ну это из-за того, что не гуляю. Разминаться надо, да и воздухом дышать тоже.',
    'Вот был карантин — так я в четырех стенах сидела и вообще никуда не ходила. Но как же это тяжело было. Да, тяжело.',
  ],
  sk2: [
    'Я не понимаю ничего. Вот ведь, суток не прошло, как я на концерте была. И уже из дома не выйдешь!',
    'Как же надоел этот ковид. Как с детьми малыми с нами, ей богу. Сама я что ли не знаю, куда надо, а куда не надо ходить? ',
  ],
};

/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({
  /**
   * constructor
   */
  init: function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(4, 5);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation('walk', [0]);
    // define a standing animation (using the first frame)
    this.renderable.addAnimation('stand', [0]);
    // set the standing animation as default
    this.renderable.setCurrentAnimation('stand');

    this.body.ignoreGravity = true;
  },

  /**
   * update the entity
   */
  update: function (dt) {
    if (me.input.isKeyPressed('left')) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);
      // update the entity velocity
      this.body.vel.x -= this.body.accel.x;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation('walk')) {
        this.renderable.setCurrentAnimation('walk');
      }
    } else if (me.input.isKeyPressed('right')) {
      // unflip the sprite
      this.renderable.flipX(false);
      // update the entity velocity
      this.body.vel.x += this.body.accel.x;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation('walk')) {
        this.renderable.setCurrentAnimation('walk');
      }
    } else if (me.input.isKeyPressed('up')) {
      this.body.vel.y = -this.body.maxVel.y;
    } else if (me.input.isKeyPressed('down')) {
      this.body.vel.y = +this.body.maxVel.y;
    } else {
      this.body.vel.x = 0;
      this.body.vel.y = 0;
      // change to the standing animation
      this.renderable.setCurrentAnimation('stand');
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
  },

  /**
   * colision handler
   */
  onCollision: function (response, other) {
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        // Simulate a platform object
        if (other.type === 'platform') {
          if (
            this.body.falling &&
            !me.input.isKeyPressed('down') &&
            // Shortest overlap would move the player upward
            response.overlapV.y > 0 &&
            // The velocity is reasonably fast enough to have penetrated to the overlap depth
            ~~this.body.vel.y >= ~~response.overlapV.y
          ) {
            // Disable collision on the x axis
            response.overlapV.x = 0;
            // Repond to the platform (it is solid)
            return true;
          }
          // Do not respond to the platform (pass through)
          return false;
        }
        break;

      case me.collision.types.ENEMY_OBJECT:
        if (response.overlapV.y > 0 && this.body.falling) {
          // bounce (force jump)
          this.body.vel.y = -this.body.maxVel.y;
          this.body.vel.x = 0;
          // play some audio
          me.audio.play('stomp');
        } else {
          // let's flicker in case we touched an enemy
          this.body.vel.x = 0;

          this.renderable.flicker(750);
        }
        return false;
        break;

      default:
        // Do not respond to other objects (e.g. coins)
        return false;
    }

    // Make the object solid
    return true;
  },
});

game.Granny = me.Entity.extend({
  /**
   * constructor
   */
  init: function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(4, 5);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation('walk', [2, 3]);
    // define a standing animation (using the first frame)
    this.renderable.addAnimation('stand', [2]);
    // set the standing animation as default
    this.renderable.setCurrentAnimation('stand');
  },

  /**
   * update the entity
   */
  update: function (dt) {
    if (me.input.isKeyPressed('left')) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);
      // update the entity velocity
      this.body.vel.x -= this.body.accel.x;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation('walk')) {
        this.renderable.setCurrentAnimation('walk');
      }
    } else if (me.input.isKeyPressed('right')) {
      // unflip the sprite
      this.renderable.flipX(false);
      // update the entity velocity
      this.body.vel.x += this.body.accel.x;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation('walk')) {
        this.renderable.setCurrentAnimation('walk');
      }
    } else {
      this.body.vel.x = 0;
      // change to the standing animation
      this.renderable.setCurrentAnimation('stand');
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
  },

  /**
   * colision handler
   */
  onCollision: function (response, other) {
    if (response.b.body.collisionType === 4) {
      this.body.accel.x = 0;
      return true;
    } else {
      this.body.accel.x = 4;
    }
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        // Simulate a platform object
        if (other.type === 'platform') {
          if (
            this.body.falling &&
            // Shortest overlap would move the player upward
            response.overlapV.y > 0 &&
            // The velocity is reasonably fast enough to have penetrated to the overlap depth
            ~~this.body.vel.y >= ~~response.overlapV.y
          ) {
            // Disable collision on the x axis
            response.overlapV.x = 0;
            // Repond to the platform (it is solid)
            return true;
          }
          // Do not respond to the platform (pass through)
          return false;
        }
        break;

      case me.collision.types.ENEMY_OBJECT:
        if (response.overlapV.y > 0 && this.body.falling) {
          // bounce (force jump)
          this.body.vel.y = -this.body.maxVel.y;
          response.overlapV.x = 0;
          this.body.vel.x = 0;

          // play some audio
          me.audio.play('stomp');
        } else {
          // let's flicker in case we touched an enemy
          // this.renderable.flicker(750);
          response.overlapV.x = 0;
          this.body.vel.x = 0;
        }
        return false;
        break;

      default:
        // Do not respond to other objects (e.g. coins)
        return false;
    }

    // Make the object solid
    return true;
  },
});

game.Dialogue = me.Entity.extend({
  init: function (x, y, settings) {
    this.stepIndex = 1;
    this.step = settings.getObjectPropertyByName('stage');
    console.log(this.step, texts[this.step]);
    game.data.text = texts[this.step][0];

    this._super(me.Entity, 'init', [x, y, settings]);
  },
  onCollision: function (response) {
    console.log(response);
    if (game.data.text !== texts[this.step][this.stepIndex]) {
      let el = document.getElementById('text');

      if (el) {
        el.remove();
      }

      const template = document.createElement('div');
      template.id = 'text';
      template.style =
        'width: 100%; height: 200px; position: absolute; bottom: 24px; text-align: center;font-size: 40px;padding: 0px 6px;';

      template.innerHTML = game.data.text;
      document.body.appendChild(template);

      window.document.body.onkeyup = (e) => {
        if (e.keyCode === 32) {
          if (this.stepIndex === texts[this.step].length) {
            let el = document.getElementById('text');
            if (el) {
              el.remove();
            }
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            // remove it
            me.game.world.removeChild(this);
            window.document.body.onkeyup = null;
          } else {
            game.data.text = texts[this.step][this.stepIndex];
            this.stepIndex++;
          }
        }
      };
    }

    return false;
  },
});

/**
 * Coin Entity
 */
game.CoatEntity = me.CollectableEntity.extend({
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y, settings]);
  },

  /**
   * colision handler
   */
  onCollision: function (response, other) {
    // do something when collide
    me.audio.play('cling');
    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    // remove it
    me.game.world.removeChild(this);

    return false;
  },
});

/**
 * Enemy Entity
 */
game.EnemyEntity = me.Entity.extend({
  init: function (x, y, settings) {
    // define this here instead of tiled
    settings.image = 'policeman';

    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;

    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
    settings.framewidth = settings.width = 670;
    settings.frameheight = settings.height = 1087;

    // redefine the default shape (used to define path) with a shape matching the renderable
    settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

    // call the parent constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - settings.framewidth;
    this.pos.x = x + width - settings.framewidth;

    // to remember which side we were walking
    this.walkLeft = false;

    // walking & jumping speed
    this.body.setVelocity(4, 6);
  },

  // manage the enemy movement
  update: function (dt) {
    // if (this.alive) {
    //   if (this.walkLeft && this.pos.x <= this.startX) {
    //     this.walkLeft = false;
    //   } else if (!this.walkLeft && this.pos.x >= this.endX) {
    //     this.walkLeft = true;
    //   }
    //   this.renderable.flipX(this.walkLeft);
    //   this.body.vel.x += this.walkLeft
    //     ? -this.body.accel.x * me.timer.tick
    //     : this.body.accel.x * me.timer.tick;
    // } else {
    //   this.body.vel.x = 0;
    // }
    // // check & update movement
    // this.body.update(dt);
    // // handle collisions against other shapes
    // me.collision.check(this);
    // // return true if we moved or if the renderable was updated
    // return this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision: function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && response.overlapV.y > 0 && response.a.body.falling) {
        // this.renderable.flicker(750);
      }
      return false;
    }
    // Make all other objects solid
    return true;
  },
});
