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
            <h3>
              {this.props.kind}
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
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
    console.log("kind", this.props.kind);
    this.bindAsArray(new Firebase(firebaseUrl + this.props.url + "/commentBox").orderByChild('kind').equalTo(this.props.kind), "data");
  },

  render: function() {
    var commentNodes = this.state.data.map(function (comment, index) {
      return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
    });
    return <div className="commentList">{commentNodes}</div>;
  }
});
var authData = false;

// Create a callback which logs the current auth state
function authDataCallback(data) {
  if (authData) {
    authData = data;
    console.log("DATA");
    console.log(data);
    console.log("User " + data.uid + " is logged in with " + data.provider);
  } else {
    authData = false;
    console.log("User is logged out");
  }
}

// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://constructive.firebaseio.com");
ref.onAuth(authDataCallback);

var CommentForm = React.createClass({

  getInitialState: function() {
    return {
      authData: false
    }
  },
  handleSubmit: function() {
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    var radios = this.refs.kinds.getElementsByTagName('input');
    var kind = false;
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        kind = radios[i].value;
        // only one radio can be logically checked, don't check the rest
        break;
      }
    }

    this.props.onCommentSubmit({author: author, text: text, kind: kind});
    this.refs.author.value = '';
    this.refs.text.value = '';
    return false;
  },
  componentDidUpdate: function() {
    // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
    componentHandler.upgradeDom();
  },

  // find a suitable name based on the meta info given by each provider
  getName: function (authData) {
    switch(authData.provider) {
       case 'password':
         return authData.password.email.replace(/@.*/, '');
       case 'twitter':
         return authData.twitter.displayName;
       case 'facebook':
         return authData.facebook.displayName;
       case 'google':
         return authData.google.displayName;
    }
  },

  doAuth: function() {
    var ref = new Firebase("https://constructive.firebaseio.com");
    var that = this;
    ref.authWithOAuthPopup("google", function(error, authData) {
      console.log(authData);
      if (error) {
        console.log("Login Failed!", error);
        that.setState({authData: false});
      } else {
        if (authData) {
          // save the user's profile into the database so we can list users,
          // use them in Security and Firebase Rules, and show profiles
          console.log("authdata", authData.uid, authData.provider, that.getName(authData));
          ref.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: that.getName(authData)
          });
        }
        that.setState({authData: authData});
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  },

  doLogout: function() {
    ref.unauth();
    this.setState({authData: false});
  },

  render: function() {
    console.log(this.state.authData);
    var name = this.getName(this.state.authData);
    if (!this.state.authData) return (
      <div>
        <button onClick={this.doAuth}>login</button>
      </div>);
    console.log("authData", this.state.authData);
    return (
      <div> 
      <div className="commentForm">

        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" ref="author" type="text" id="author" defaultValue={name}></input>
          <label className="mdl-textfield__label" htmlFor="author">Your Name</label>
        </div>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" ref="text" type="text" id="text"/>
          <label className="mdl-textfield__label" htmlFor="text">Appreciation</label>
        </div>
        <div className="kinds" ref="kinds">
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
            <input className="mdl-radio__button" ref="kind3" id="kind3" name="kind" type="radio" value="opportunity"/>
            <span className="mdl-radio__label">Opportunity</span>
          </label>
          <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="kind4">
            <input className="mdl-radio__button" ref="kind4" id="kind4" name="kind" type="radio" value="concern"/>
            <span className="mdl-radio__label">Concern</span>
          </label>
          <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="kind5">
            <input className="mdl-radio__button" ref="kind5" id="kind5" name="kind" type="radio" value="twist"/>
            <span className="mdl-radio__label">Twist</span>
          </label>
        </div>
        <button onClick={this.handleSubmit} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
          Offer
        </button>
        <button onClick={this.doLogout}>logout</button>
      </div>
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
    this.bindAsArray(new Firebase(firebaseUrl + this.props.url + "/commentBox"), "data");
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
                    <CommentList kind="appreciation" url={this.props.url} />
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-2">
                  <div className="page-content">
                    <CommentList kind="simplification" url={this.props.url} />
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-3">
                  <div className="page-content">
                    <CommentList kind="opportunity" url={this.props.url} />
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-4">
                  <div className="page-content">
                    <CommentList kind="concern" url={this.props.url} />
                  </div>
                </section>
                <section className="mdl-layout__tab-panel" id="scroll-tab-5">
                  <div className="page-content">
                    <CommentList kind="twist" url={this.props.url} />
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
  <CommentBox url="localhost:8080"/>,
  document.getElementById('content')
);
