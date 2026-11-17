const { describe, it } = require('node:test');
const assert = require('node:assert');
const { loadSourceFile, assertDeepEqual } = require('../setup');

/**
 * Wait before turning things off: which changes count as loosening.
 * Turning things on is never delayed; turning them off (even as a side
 * effect of turning something else on) is.
 */
const main = loadSourceFile('shared/main.js');

describe('wait before turning things off', () => {
  describe('changesLoosen', () => {
    it('turning an option off loosens; turning it on does not', () => {
      assert.strictEqual(main.changesLoosen({ remove_homepage: false }, { remove_homepage: true }), true);
      assert.strictEqual(main.changesLoosen({ remove_homepage: true }, { remove_homepage: false }), false);
    });

    it('turning off something already off is not loosening', () => {
      assert.strictEqual(main.changesLoosen({ remove_homepage: false }, {}), false);
    });

    it('turning RYS off loosens; turning it on does not', () => {
      assert.strictEqual(main.changesLoosen({ global_enable: false }, { global_enable: true }), true);
      assert.strictEqual(main.changesLoosen({ global_enable: true }, { global_enable: false }), false);
    });

    it('options that are looser when on are inverted', () => {
      assert.strictEqual(main.changesLoosen({ add_reveal_homepage: true }, { add_reveal_homepage: false }), true);
      assert.strictEqual(main.changesLoosen({ add_reveal_homepage: false }, { add_reveal_homepage: true }), false);
    });

    it('turning an option on that turns another off as a side effect loosens', () => {
      // "Hide all but the first row" turns "Hide all homepage suggestions" off.
      const changes = main.toggleChanges('remove_all_but_one', true);
      assert.strictEqual(changes.remove_homepage, false);
      assert.strictEqual(main.changesLoosen(changes, { remove_homepage: true }), true);
      assert.strictEqual(main.changesLoosen(changes, { remove_homepage: false }), false);
    });

    it('turning on a redirect is not loosening, though it clears redirect_off', () => {
      const changes = main.toggleChanges('redirect_to_subs', true);
      assert.strictEqual(main.changesLoosen(changes, { redirect_off: true }), false);
    });
  });

  describe('toggleChanges', () => {
    it('includes the option and its effects for that value', () => {
      assertDeepEqual(main.toggleChanges('remove_comments', true), { remove_comments: true });
      assertDeepEqual(main.toggleChanges('menu_timer', true), { menu_timer: true, lock_code: false });
    });
  });

  describe('pillChangeLoosens', () => {
    it('removing a blocked keyword loosens; adding one does not', () => {
      assert.strictEqual(main.pillChangeLoosens('removed', ['news', 'politics'], ['news']), true);
      assert.strictEqual(main.pillChangeLoosens('removed', ['news'], ['news', 'politics']), false);
    });

    it('adding a channel kept in color loosens; removing one does not', () => {
      assert.strictEqual(main.pillChangeLoosens('added', ['@a'], ['@a', '@b']), true);
      assert.strictEqual(main.pillChangeLoosens('added', ['@a', '@b'], ['@a']), false);
    });

    it('ignores case changes', () => {
      assert.strictEqual(main.pillChangeLoosens('removed', ['News'], ['news']), false);
    });
  });

  describe('parseUnlockDelay', () => {
    it('reads whole minutes from numbers and imported strings', () => {
      assert.strictEqual(main.parseUnlockDelay(2), 2);
      assert.strictEqual(main.parseUnlockDelay('5'), 5);
      assert.strictEqual(main.parseUnlockDelay('2.7'), 2);
    });

    it('treats missing or invalid values as off, and caps at 120', () => {
      assert.strictEqual(main.parseUnlockDelay(undefined), 0);
      assert.strictEqual(main.parseUnlockDelay('abc'), 0);
      assert.strictEqual(main.parseUnlockDelay(-3), 0);
      assert.strictEqual(main.parseUnlockDelay(999), 120);
    });
  });
});
