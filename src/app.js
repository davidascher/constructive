var Showdown = require("showdown")

var firebaseUrl = "https://constructive.firebaseio.com/";

var converter = new Showdown.Converter();


var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <div className="demo-card-event mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand">
          <div className="card_contents">
            <h4>
              {this.props.author}:
            </h4>
            <h3>  
            <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </h3>
          </div>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Thank
            </a>
            <div className="mdl-layout-spacer"></div>
            <i className="material-icons">face</i>
          </div>
        </div>
      </div>

    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment, index) {
      return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
    });
    return <div className="commentList">{commentNodes}</div>;
  }
});

var CommentForm = React.createClass({
  handleSubmit: function() {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  componentDidUpdate: function() {
    // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
    componentHandler.upgradeDom();
  },

  render: function() {
    return (
      <div>
      <form action="#" className="commentForm" onSubmit={this.handleSubmit}>

        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" ref="author" type="text" id="author"/>
          <label className="mdl-textfield__label" htmlFor="author">Your name</label>
        </div>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" ref="text" type="text" id="text"/>
          <label className="mdl-textfield__label" htmlFor="text">Appreciation</label>
        </div>
        <div className="kinds">
          <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="kind1">
            <input defaultChecked className="mdl-radio__button" ref="kind1" id="kind1" name="kind" type="radio"
             value="appreciation"/>
            <span className="mdl-radio__label">Appreciation</span>
          </label>
            <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="kind2">
            <input className="mdl-radio__button" ref="kind2" id="kind2" name="kind" type="radio" value="simplification"/>
            <span className="mdl-radio__label">Simplification</span>
          </label>
          <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="kind3">
            <input className="mdl-radio__button" ref="kind3" id="kind3" name="kind" type="radio" value="twist"/>
            <span className="mdl-radio__label">Twist</span>
          </label>
        </div>
        <button type="submit" onclick={this.handleSubmit} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
          Offer
        </button>
      </form>
</div>
    );
  }
});


var CommentBox = React.createClass({
  mixins: [ReactFireMixin],

  handleCommentSubmit: function(comment) {
    // Here we push the update out to Firebase and let ReactFire update this.state.data
    this.firebaseRefs["data"].push(comment);
  },

  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidUpdate: function() {
    // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
    componentHandler.upgradeDom();
  },
  componentDidMount: function() {
    // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
    componentHandler.upgradeDom();
  },

  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    this.bindAsArray(new Firebase(firebaseUrl + "commentBox"), "data");
  },

  render: function() {
    return (
      <div className="commentBox">
        <div className="mdl-layout mdl-js-layout">
          <main className="mdl-layout__content">
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
              <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                  <span className="mdl-layout-title">Feedback</span>
                </div>
                <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                  <a href="#scroll-tab-1" className="mdl-layout__tab is-active">Appreciations</a>
                  <a href="#scroll-tab-2" className="mdl-layout__tab">Simplifications</a>
                  <a href="#scroll-tab-3" className="mdl-layout__tab">Opportunities</a>
                  <a href="#scroll-tab-4" className="mdl-layout__tab">Concerns</a>
                  <a href="#scroll-tab-5" className="mdl-layout__tab">Twists</a>
                  <a href="#scroll-tab-6" className="mdl-layout__tab">+</a>
                </div>
              </header>
              <main className="mdl-layout__content">
                <section className="mdl-layout__tab-panel is-active" id="scroll-tab-1">
                  <div className="page-content">
                    <CommentList kind="appreciation" data={this.state.data} />
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-2">
                  <div className="page-content">
                    <CommentList kind="simplifications" data={this.state.data} />
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-3">
                  <div className="page-content">

                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-4">
                  <div className="page-content">

                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-5">
                  <div className="page-content">
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-6">
                  <div className="page-content">
                    <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                  </div>
                </section>
              </main>
            </div>
          </main>
        </div>
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
