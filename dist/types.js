"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertKind = exports.Criticity = void 0;
//SQUAR TestAlert type
var AlertKind;
(function (AlertKind) {
    AlertKind[AlertKind["test_case"] = 0] = "test_case";
    AlertKind[AlertKind["test_suite"] = 1] = "test_suite";
    AlertKind[AlertKind["edge_case"] = 2] = "edge_case";
})(AlertKind || (AlertKind = {}));
exports.AlertKind = AlertKind;
var Criticity;
(function (Criticity) {
    Criticity[Criticity["green"] = 0] = "green";
    Criticity[Criticity["orange"] = 1] = "orange";
    Criticity[Criticity["red"] = 2] = "red";
})(Criticity || (Criticity = {}));
exports.Criticity = Criticity;
