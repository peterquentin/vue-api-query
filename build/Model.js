"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _Builder = _interopRequireDefault(require("./Builder"));

var _StaticModel2 = _interopRequireDefault(require("./StaticModel"));

var _removeWrapping = function _removeWrapping(data) {
  Object.keys(data).forEach(function (key) {
    var value = data[key];

    if (value && typeof value.data !== "undefined" && Array.isArray(value.data)) {
      data[key] = value.data;
    }
  });
};

var Model =
/*#__PURE__*/
function (_StaticModel) {
  (0, _inherits2.default)(Model, _StaticModel);

  function Model() {
    var _this;

    (0, _classCallCheck2.default)(this, Model);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Model).call(this));

    for (var _len = arguments.length, atributtes = new Array(_len), _key = 0; _key < _len; _key++) {
      atributtes[_key] = arguments[_key];
    }

    if (atributtes.length === 0) {
      _this._builder = new _Builder.default((0, _assertThisInitialized2.default)(_this));
    } else {
      Object.assign.apply(Object, [(0, _assertThisInitialized2.default)(_this)].concat(atributtes));
    }

    if (_this.baseURL === undefined) {
      throw new Error('You must declare baseURL() method.');
    }

    if (_this.request === undefined) {
      throw new Error('You must declare request() method.');
    }

    if (_this.$http === undefined) {
      throw new Error('You must set $http property');
    }

    return _this;
  }
  /**
   *  Setup
   */


  (0, _createClass2.default)(Model, [{
    key: "resource",
    value: function resource() {
      return "".concat(this.constructor.name.toLowerCase(), "s");
    }
  }, {
    key: "primaryKey",
    value: function primaryKey() {
      return 'id';
    }
  }, {
    key: "getPrimaryKey",
    value: function getPrimaryKey() {
      return this[this.primaryKey()];
    }
  }, {
    key: "custom",
    value: function custom() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length === 0) {
        throw new Error('The custom() method takes a minimum of one argument.');
      } // It would be unintuitive for users to manage where the '/' has to be for
      // multiple arguments. We don't need it for the first argument if it's
      // a string, but subsequent string arguments need the '/' at the beginning.
      // We handle this implementation detail here to simplify the readme.


      var slash = '';
      var resource = '';
      args.forEach(function (value) {
        switch (true) {
          case typeof value === 'string':
            resource += slash + value.replace(/^\/+/, '');
            break;

          case value instanceof Model:
            resource += slash + value.resource();

            if (value.isValidId(value.getPrimaryKey())) {
              resource += '/' + value.getPrimaryKey();
            }

            break;

          default:
            throw new Error('Arguments to custom() must be strings or instances of Model.');
        }

        if (!slash.length) {
          slash = '/';
        }
      });
      this._customResource = resource;
      return this;
    }
  }, {
    key: "hasMany",
    value: function hasMany(model) {
      var instance = new model();
      var url = "".concat(this.baseURL(), "/").concat(this.resource(), "/").concat(this.getPrimaryKey(), "/").concat(instance.resource());

      instance._from(url);

      return instance;
    }
  }, {
    key: "_from",
    value: function _from(url) {
      Object.defineProperty(this, '_fromResource', {
        get: function get() {
          return url;
        }
      });
    }
  }, {
    key: "for",
    value: function _for() {
      var _this2 = this;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      if (args.length === 0) {
        throw new Error('The for() method takes a minimum of one argument.');
      }

      var url = "".concat(this.baseURL());
      args.forEach(function (object) {
        if (object instanceof Model === false) {
          throw new Error('The object referenced on for() method is not a valid Model.');
        }

        if (!_this2.isValidId(object.getPrimaryKey())) {
          throw new Error('The object referenced on for() method has a invalid id.');
        }

        url += "/".concat(object.resource(), "/").concat(object.getPrimaryKey());
      });
      url += "/".concat(this.resource());

      this._from(url);

      return this;
    }
    /**
     * Helpers
     */

  }, {
    key: "hasId",
    value: function hasId() {
      var id = this.getPrimaryKey();
      return this.isValidId(id);
    }
  }, {
    key: "isValidId",
    value: function isValidId(id) {
      return id !== undefined && id !== 0 && id !== '';
    }
  }, {
    key: "endpoint",
    value: function endpoint() {
      if (this._fromResource) {
        if (this.hasId()) {
          return "".concat(this._fromResource, "/").concat(this.getPrimaryKey());
        } else {
          return this._fromResource;
        }
      }

      if (this.hasId()) {
        return "".concat(this.baseURL(), "/").concat(this.resource(), "/").concat(this.getPrimaryKey());
      } else {
        return "".concat(this.baseURL(), "/").concat(this.resource());
      }
    }
  }, {
    key: "parameterNames",
    value: function parameterNames() {
      return {
        include: 'include',
        filter: 'filter',
        sort: 'sort',
        fields: 'fields',
        append: 'append',
        page: 'page',
        limit: 'limit'
      };
    }
    /**
     *  Query
     */

  }, {
    key: "include",
    value: function include() {
      var _this$_builder;

      (_this$_builder = this._builder).include.apply(_this$_builder, arguments);

      return this;
    }
  }, {
    key: "append",
    value: function append() {
      var _this$_builder2;

      (_this$_builder2 = this._builder).append.apply(_this$_builder2, arguments);

      return this;
    }
  }, {
    key: "select",
    value: function select() {
      var _this$_builder3;

      (_this$_builder3 = this._builder).select.apply(_this$_builder3, arguments);

      return this;
    }
  }, {
    key: "where",
    value: function where(field, value) {
      this._builder.where(field, value);

      return this;
    }
  }, {
    key: "whereIn",
    value: function whereIn(field, array) {
      this._builder.whereIn(field, array);

      return this;
    }
  }, {
    key: "orderBy",
    value: function orderBy() {
      var _this$_builder4;

      (_this$_builder4 = this._builder).orderBy.apply(_this$_builder4, arguments);

      return this;
    }
  }, {
    key: "page",
    value: function page(value) {
      this._builder.page(value);

      return this;
    }
  }, {
    key: "limit",
    value: function limit(value) {
      this._builder.limit(value);

      return this;
    }
  }, {
    key: "params",
    value: function params(payload) {
      this._builder.params(payload);

      return this;
    }
    /**
     * Result
     */

  }, {
    key: "first",
    value: function first() {
      return this.get().then(function (response) {
        return response[0] || {};
      });
    }
  }, {
    key: "find",
    value: function find(identifier) {
      var _this3 = this;

      if (identifier === undefined) {
        throw new Error('You must specify the param on find() method.');
      }

      var base = this._fromResource || "".concat(this.baseURL(), "/").concat(this.resource());
      var url = "".concat(base, "/").concat(identifier).concat(this._builder.query());
      return this.request({
        url: url,
        method: 'GET'
      }).then(function (response) {
        return new _this3.constructor(_this3._resolveResponse(response));
      });
    }
  }, {
    key: "get",
    value: function get() {
      var _this4 = this;

      var base = this._fromResource || "".concat(this.baseURL(), "/").concat(this.resource());
      base = this._customResource ? "".concat(this.baseURL(), "/").concat(this._customResource) : base;
      var url = "".concat(base).concat(this._builder.query());
      return this.request({
        url: url,
        method: 'GET'
      }).then(function (response) {
        var collection = response.data.data || response.data;
        collection = Array.isArray(collection) ? collection : [collection];
        collection = collection.map(function (c) {
          var item = new _this4.constructor(c);
          Object.defineProperty(item, '_fromResource', {
            get: function get() {
              return _this4._fromResource;
            }
          });
          return item;
        });
        response.data.data ? response.data.data = collection : response.data = collection;
        return _this4._resolveResponse(response);
      });
    }
  }, {
    key: "$get",
    value: function $get() {
      return this.get().then(function (response) {
        return response.data || response;
      });
    }
  }, {
    key: "_resolveResponse",
    value: function _resolveResponse(response) {
      var data = response.data.data || response.data;
      Array.isArray(data) ? data.map(function (item) {
        return _removeWrapping(item);
      }) : _removeWrapping(data);
      return data;
    }
    /**
     * Common CRUD operations
     */

  }, {
    key: "delete",
    value: function _delete() {
      if (!this.hasId()) {
        throw new Error('This model has a empty ID.');
      }

      return this.request({
        url: this.endpoint(),
        method: 'DELETE'
      }).then(function (response) {
        return response;
      });
    }
  }, {
    key: "save",
    value: function save() {
      return this.hasId() ? this._update() : this._create();
    }
  }, {
    key: "_create",
    value: function _create() {
      var _this5 = this;

      return this.$http.post(this.endpoint(), this.formData || this).then(function (response) {
        var self = Object.assign(_this5, _this5._resolveResponse(response));
        return self;
      });
    }
  }, {
    key: "_update",
    value: function _update() {
      var _this6 = this;

      var method = this.formData ? 'post' : 'put';
      return this.$http[method](this.endpoint(), this.formData || this).then(function (response) {
        var self = Object.assign(_this6, _this6._resolveResponse(response));
        return self;
      });
    }
    /**
     * Relationship operations
     */

  }, {
    key: "attach",
    value: function attach(params) {
      return this.request({
        method: 'POST',
        url: this.endpoint(),
        data: params
      }).then(function (response) {
        return response;
      });
    }
  }, {
    key: "sync",
    value: function sync(params) {
      return this.request({
        method: 'PUT',
        url: this.endpoint(),
        data: params
      }).then(function (response) {
        return response;
      });
    }
  }, {
    key: "$http",
    get: function get() {
      return Model.$http;
    }
  }]);
  return Model;
}(_StaticModel2.default);

exports.default = Model;