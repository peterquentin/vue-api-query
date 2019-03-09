"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Parser = _interopRequireDefault(require("./Parser"));

/**
 * Prepare attributes to be parsed
 */
var Builder =
/*#__PURE__*/
function () {
  function Builder(model) {
    (0, _classCallCheck2.default)(this, Builder);
    this.model = model;
    this.includes = [];
    this.appends = [];
    this.sorts = [];
    this.pageValue = null;
    this.limitValue = null;
    this.payload = null;
    this.fields = {};
    this.filters = {};
    this.parser = new _Parser.default(this);
  } // query string parsed 


  (0, _createClass2.default)(Builder, [{
    key: "query",
    value: function query() {
      return this.parser.query();
    }
    /**
     * Query builder
     */

  }, {
    key: "include",
    value: function include() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.includes = args;
      return this;
    }
  }, {
    key: "append",
    value: function append() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.appends = args;
      return this;
    }
  }, {
    key: "select",
    value: function select() {
      var _this = this;

      for (var _len3 = arguments.length, fields = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fields[_key3] = arguments[_key3];
      }

      if (fields.length === 0) {
        throw new Error('You must specify the fields on select() method.');
      } // single entity .select(['age', 'firstname'])


      if (fields[0].constructor === String || Array.isArray(fields[0])) {
        this.fields[this.model.resource()] = fields.join(',');
      } // related entities .select({ posts: ['title', 'content'], user: ['age', 'firstname']} )


      if (fields[0].constructor === Object) {
        Object.entries(fields[0]).forEach(function (_ref) {
          var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          _this.fields[key] = value.join(',');
        });
      }

      return this;
    }
  }, {
    key: "where",
    value: function where(key, value) {
      if (key === undefined || value === undefined) throw new Error('The KEY and VALUE are required on where() method.');
      if (Array.isArray(value) || value instanceof Object) throw new Error('The VALUE must be primitive on where() method.');
      this.filters[key] = value;
      return this;
    }
  }, {
    key: "whereIn",
    value: function whereIn(key, array) {
      if (!Array.isArray(array)) throw new Error('The second argument on whereIn() method must be an array.');
      this.filters[key] = array.join(',');
      return this;
    }
  }, {
    key: "orderBy",
    value: function orderBy() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this.sorts = args;
      return this;
    }
  }, {
    key: "page",
    value: function page(value) {
      if (!Number.isInteger(value)) {
        throw new Error('The VALUE must be an integer on page() method.');
      }

      this.pageValue = value;
      return this;
    }
  }, {
    key: "limit",
    value: function limit(value) {
      if (!Number.isInteger(value)) {
        throw new Error('The VALUE must be an integer on limit() method.');
      }

      this.limitValue = value;
      return this;
    }
  }, {
    key: "params",
    value: function params(payload) {
      if (payload === undefined || payload.constructor !== Object) {
        throw new Error('You must pass a payload/object as param.');
      }

      this.payload = payload;
      return this;
    }
  }]);
  return Builder;
}();

exports.default = Builder;