"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsLive = void 0;
const typeorm_1 = require("typeorm");
const Installations_1 = require("./Installations");
let TagsLive = class TagsLive {
};
exports.TagsLive = TagsLive;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TagsLive.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TagsLive.prototype, "lastSynchroDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TagsLive.prototype, "dateReq", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TagsLive.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TagsLive.prototype, "quality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TagsLive.prototype, "alarmHint", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TagsLive.prototype, "ewonTagId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Installations_1.Installation, (installation) => installation.tagsLive),
    (0, typeorm_1.JoinColumn)({ name: 'installationId' }),
    __metadata("design:type", Installations_1.Installation)
], TagsLive.prototype, "installation", void 0);
exports.TagsLive = TagsLive = __decorate([
    (0, typeorm_1.Entity)('tags_live')
], TagsLive);
//# sourceMappingURL=TagsLive.js.map