# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* 支持更多的语言，目前暂时只支持C
* 将注释模板化，可自行填充相关配置

## [0.1.0] - 2022-11-22

### Added

* 行内字符串替换功能

### Changed

* 修改了注释添加删除时的快捷键

## [0.0.2] - 2022-11-09

### Added

- 可以在设置里直接跳转到 `settings.json`里进行相应配置，并提供了提示功能

### fixed

* 修复了删除一行时会在前面多出一个空格的问题
* 修复了添加代码块时没有 `begin, end`标识的问题

## [0.0.1] - 2022-11-08

### Added

* 仅限C语言进行添加注释
* 选择有代码行进行添加代码注释时，将会在原字符串后面添加注释 `/*add by ${user} ${date} ${description}*/`
* 选择无代码行进行添加代码注释时，将会分两行添加

```
/* add by ${user} ${date} ${description} begin */
/* add by ${user} ${date} ${description} end */
```

* 选择有代码行进行删除代码注释时，会把代码删除，并添加 `/* delete by ${user} ${date} ${description}*/`
* 选择多行代码进行删除代码注释时，将会把代码包在 `#if 0  ... #endif`中
