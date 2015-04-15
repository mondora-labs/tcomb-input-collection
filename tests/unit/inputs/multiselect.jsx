var sinon  = require("sinon");
var should = require("should");
var t      = require("tcomb");

// Instantiate a fake dom. We must do it before requiring React, otherwise we'll
// get an Invariant Violation error. See http://stackoverflow.com/a/26872245 for
// details.
require("../../test-dom.js")("<html><body></body></html>");

var React = require("react/addons");
var u = React.addons.TestUtils;

var Multiselect = require("inputs/multiselect.jsx");

var reg = function (string) {
    return new RegExp(string);
};

describe("Multiselect", function () {

    var checkboxes;
    var onChange;
    beforeEach(function () {
        var ctx = {
            report: {
                type: t.enums.of("a b c")
            }
        };
        onChange = sinon.spy();
        var multiselect = u.renderIntoDocument(
            <Multiselect
                ctx={ctx}
                value={["a"]}
                onChange={onChange}
            />
        );
        checkboxes = u.scryRenderedDOMComponentsWithTag(multiselect, "input");
    });

    it("should contain checkboxes", function () {
        checkboxes.length.should.equal(3);
        checkboxes.forEach(function (checkbox) {
            checkbox.props.type.should.equal("checkbox");
        });
    });

    it("should render checkboxes with the correct checked status based on the value passed to the component", function () {
        var aInput = checkboxes[0].getDOMNode();
        var bInput = checkboxes[1].getDOMNode();
        var cInput = checkboxes[2].getDOMNode();
        aInput.checked.should.equal(true);
        bInput.checked.should.equal(false);
        cInput.checked.should.equal(false);
    });

    it("should change checked status on checkbox click", function () {
        var aInput = checkboxes[0].getDOMNode();
        var bInput = checkboxes[1].getDOMNode();
        var cInput = checkboxes[2].getDOMNode();
        React.addons.TestUtils.Simulate.change(aInput);
        React.addons.TestUtils.Simulate.change(bInput);
        React.addons.TestUtils.Simulate.change(cInput);
        aInput.checked.should.equal(false);
        bInput.checked.should.equal(true);
        cInput.checked.should.equal(true);
        React.addons.TestUtils.Simulate.change(aInput);
        React.addons.TestUtils.Simulate.change(bInput);
        React.addons.TestUtils.Simulate.change(cInput);
        aInput.checked.should.equal(true);
        bInput.checked.should.equal(false);
        cInput.checked.should.equal(false);
    });

    it("should call onChange with the new status", function () {
        var aInput = checkboxes[0].getDOMNode();
        var bInput = checkboxes[1].getDOMNode();
        var cInput = checkboxes[2].getDOMNode();
        // Click on checkbox a
        onChange.reset();
        React.addons.TestUtils.Simulate.change(aInput);
        onChange.calledWith([]).should.equal(true);
        // Click on checkbox b
        onChange.reset();
        React.addons.TestUtils.Simulate.change(bInput);
        onChange.calledWith(["b"]).should.equal(true);
        // Click on checkbox c
        onChange.reset();
        React.addons.TestUtils.Simulate.change(cInput);
        onChange.calledWith(["b", "c"]).should.equal(true);
    });

});
