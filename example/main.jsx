var React = require("react/addons");
var t     = require("tcomb-form");

var Inputs = require("../");

var App = React.createClass({
    render: function () {
        return (
            <div className="container-fluid">
                <br />
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3">
                        <h3>SimpleStringList input</h3>
                        <t.form.Form
                            type={t.struct({
                                strings: t.list(t.Str)
                            })}
                            options={{
                                fields: {
                                    strings: {
                                        factory: Inputs.SimpleStringList
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

window.React = React;
