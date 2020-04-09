var expect = require('chai').expect;


// DELETE OR COMMENT THE FOLLOWING describe =========>>>

const PREVENT_COMMIT_TO_SUCCEED = false;

describe('#git pre-commit hook', function() {
	it('SHOULD ABORT ANY COMMIT UNTIL YOU FIX THISFILE -> ./test/index.js', function() {
		expect(PREVENT_COMMIT_TO_SUCCEED).to.equal(false, 'remove this test or set PREVENT_COMMIT_TO_SUCCEED = false');
	});
});

// <<<=========