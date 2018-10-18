"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@tspower/core");
var rxjs_1 = require("rxjs");
var Select = /** @class */ (function () {
    function Select(Root, Name, Index, Display, PreselectIndex, Placeholder, Group, Data, Id, Class, Style) {
        if (Placeholder === void 0) { Placeholder = "Select an Item"; }
        var _this = this;
        this.Root = Root;
        this.Name = Name;
        this.Index = Index;
        this.Display = Display;
        this.PreselectIndex = PreselectIndex;
        this.Placeholder = Placeholder;
        this.Group = Group;
        this.Data = Data;
        this.Id = Id;
        this.Class = Class;
        this.Style = Style;
        this.updated = new rxjs_1.Subject();
        this.changed = new rxjs_1.Subject();
        this.selected = new rxjs_1.Subject();
        this.sel = false;
        this.enab = new rxjs_1.Subject();
        this.disab = new rxjs_1.Subject();
        this.updated$ = this.updated.asObservable();
        this.changed$ = this.changed.asObservable();
        this.selected$ = this.selected.asObservable();
        this.enabled$ = this.enab.asObservable();
        this.disabled$ = this.disab.asObservable();
        this.init = function () {
            _this.node.addEventListener("change", function (event) {
                _this.selectedIndex = _this.node.options[_this.node.selectedIndex].value;
                _this.selectedDisplay = _this.node.options[_this.node.selectedIndex].text;
                var option = _this.node.options.item(_this.node.selectedIndex);
                option.setAttribute("selected", '');
                if (_this.selectedIndex == "unselect") {
                    _this.selected.next(false);
                    _this.sel = false;
                }
                else {
                    _this.sel = true;
                    _this.selected.next(true);
                }
                _this.changed.next({ index: _this.selectedIndex, display: _this.selectedDisplay });
            });
        };
        this.create = function () {
            var id = (_this.Id) ? "id=\"" + _this.Id + "\"" : null;
            var classe = (_this.Class) ? "class=\"" + _this.Class + "\"" : null;
            var stile = (_this.Style) ? "style=\"" + _this.Style + "\"" : null;
            var gruppo = (_this.Group) ? "data-group=\"" + _this.Group + "\"" : null;
            var template = "<select name=\"" + _this.Name + "\" " + ((id) ? id : "") + " " + ((classe) ? classe : "") + " " + ((stile) ? stile : "") + "  " + ((gruppo) ? gruppo : "") + ">\n                        </select>";
            _this.node = core_1.htmlParse(template);
            if (_this.Data) {
                _this.populate();
            }
            _this.Root.appendChild(_this.node);
        };
        this.option = function (Index, Display, preset) {
            var sel = (preset) ? "selected" : "";
            var template = "<option value=\"" + Index + "\" " + sel + " > " + Display + " </option>";
            return core_1.htmlParse(template);
        };
        this.placeholder = function () {
            var pre = (_this.PreselectIndex == "unselect" || _this.PreselectIndex == null) ? "selected" : null;
            return core_1.htmlParse("<option value=\"unselect\" " + ((pre != null) ? pre : "") + ">" + _this.Placeholder + "</option>");
        };
        this.populate = function (atStart) {
            if (atStart === void 0) { atStart = true; }
            core_1.empty(_this.node);
            _this.node.appendChild(_this.placeholder());
            _this.Data.forEach(function (e, i) {
                var pres_index = (atStart) ? (e[_this.Index] == _this.PreselectIndex) ? true : false : null;
                _this.node.appendChild(_this.option(e[_this.Index], e[_this.Display], pres_index));
            });
        };
        this.unselAll = function () {
            var s = _this.node.querySelector("option[selected]");
            s.removeAttribute("selected");
        };
        this.selItem = function (value) {
            _this.unselAll();
            var option = _this.node.querySelector("option[value=\"" + value + "\"]");
            option.setAttribute("selected", '');
        };
        //shared method
        this.isSelected = function () { return _this.sel; };
        this.unselect = function () {
            _this.selItem("unselect");
        };
        this.select = function (Index) {
            _this.selItem(Index);
        };
        this.setGroup = function (group) {
            _this.Group = group;
            _this.node.setAttribute("data-group", _this.Group);
        };
        this.removeGroup = function () {
            _this.Group = null;
            _this.node.removeAttribute("data-group");
        };
        this.setData = function (data) {
            _this.Data = data;
            _this.populate(false);
            _this.updated.next(true);
        };
        this.removeData = function () {
            _this.Data = [];
            _this.populate(false);
            _this.updated.next(true);
        };
        this.setClass = function (Class) {
            _this.node.classList.add(Class);
        };
        this.removeClass = function (Class) {
            _this.node.classList.remove(Class);
        };
        this.setStyle = function (Style) {
            _this.node.setAttribute("style", Style);
        };
        this.removeStyle = function () {
            _this.node.removeAttribute("style");
        };
        this.enable = function () {
            _this.node.disabled = false;
            _this.node.removeAttribute("disabled");
            _this.enab.next({ name: _this.Name, enabled: true });
        };
        this.disable = function () {
            _this.node.disabled = true;
            _this.node.setAttribute("disabled", "disabled");
            _this.disab.next({ name: _this.Name, enabled: false });
        };
        this.create();
        this.init();
    }
    return Select;
}());
exports.Select = Select;
