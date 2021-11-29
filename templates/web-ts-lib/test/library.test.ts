import assert from 'assert';
import <%= projectCodeName %> from '../src/lib/library';

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    assert.ok(true);
  });

  it('DummyClass is instantiable', () => {
    assert.ok(new <%= projectCodeName %>({}) instanceof <%= projectCodeName %>);
  });
});
