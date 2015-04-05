var React = require("react");
var t     = require("tcomb-form");

var Inputs = require("../");

var App = React.createClass({
    render: function () {
        return (
            <div className="container-fluid">
                <br />
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3">
                        <t.form.Form
                            type={t.struct({
                                tags: t.list(t.Str)
                            })}
                            options={{
                                fields: {
                                    tags: {
                                        factory: Inputs.TagsInput
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
});
React.render(<App />, document.body);
