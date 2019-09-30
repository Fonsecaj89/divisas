/*!
 * # Semantic UI - Form Validation
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

(function($, window, document, undefined) {
    window =
        typeof window !== 'undefined' && window.Math == Math
            ? window
            : typeof self !== 'undefined' && self.Math == Math
            ? self
            : Function('return this')();

    $.fn.form = function(parameters) {
        const $allModules = $(this);
        const moduleSelector = $allModules.selector || '';

        let time = new Date().getTime();
        let performance = [];

        const query = arguments[0];
        const legacyParameters = arguments[1];
        const methodInvoked = typeof query === 'string';
        const queryArguments = [].slice.call(arguments, 1);
        let returnedValue;
        $allModules.each(function() {
            const $module = $(this);
            const element = this;

            let formErrors = [];
            let keyHeldDown = false;

            // set at run-time
            let $field;
            let $group;
            let $message;
            let $prompt;
            let $submit;
            let $clear;
            let $reset;

            let settings;
            let validation;

            let metadata;
            let selector;
            let className;
            let regExp;
            let error;

            let namespace;
            let moduleNamespace;
            let eventNamespace;

            let instance;
            let module;
            module = {
                initialize() {
                    // settings grabbed at run time
                    module.get.settings();
                    if (methodInvoked) {
                        if (instance === undefined) {
                            module.instantiate();
                        }
                        module.invoke(query);
                    } else {
                        if (instance !== undefined) {
                            instance.invoke('destroy');
                        }
                        module.verbose('Initializing form validation', $module, settings);
                        module.bindEvents();
                        module.set.defaults();
                        module.instantiate();
                    }
                },

                instantiate() {
                    module.verbose('Storing instance of module', module);
                    instance = module;
                    $module.data(moduleNamespace, module);
                },

                destroy() {
                    module.verbose('Destroying previous module', instance);
                    module.removeEvents();
                    $module.removeData(moduleNamespace);
                },

                refresh() {
                    module.verbose('Refreshing selector cache');
                    $field = $module.find(selector.field);
                    $group = $module.find(selector.group);
                    $message = $module.find(selector.message);
                    $prompt = $module.find(selector.prompt);

                    $submit = $module.find(selector.submit);
                    $clear = $module.find(selector.clear);
                    $reset = $module.find(selector.reset);
                },

                submit() {
                    module.verbose('Submitting form', $module);
                    $module.submit();
                },

                attachEvents(selector, action) {
                    action = action || 'submit';
                    $(selector).on(`click${eventNamespace}`, function(event) {
                        module[action]();
                        event.preventDefault();
                    });
                },

                bindEvents() {
                    module.verbose('Attaching form events');
                    $module
                        .on(`submit${eventNamespace}`, module.validate.form)
                        .on(`blur${eventNamespace}`, selector.field, module.event.field.blur)
                        .on(`click${eventNamespace}`, selector.submit, module.submit)
                        .on(`click${eventNamespace}`, selector.reset, module.reset)
                        .on(`click${eventNamespace}`, selector.clear, module.clear);
                    if (settings.keyboardShortcuts) {
                        $module.on(
                            `keydown${eventNamespace}`,
                            selector.field,
                            module.event.field.keydown
                        );
                    }
                    $field.each(function() {
                        const $input = $(this);
                        const type = $input.prop('type');
                        const inputEvent = module.get.changeEvent(type, $input);
                        $(this).on(inputEvent + eventNamespace, module.event.field.change);
                    });
                },

                clear() {
                    $field.each(function() {
                        const $field = $(this);
                        const $element = $field.parent();
                        const $fieldGroup = $field.closest($group);
                        const $prompt = $fieldGroup.find(selector.prompt);
                        const defaultValue = $field.data(metadata.defaultValue) || '';
                        const isCheckbox = $element.is(selector.uiCheckbox);
                        const isDropdown = $element.is(selector.uiDropdown);
                        const isErrored = $fieldGroup.hasClass(className.error);
                        if (isErrored) {
                            module.verbose('Resetting error on field', $fieldGroup);
                            $fieldGroup.removeClass(className.error);
                            $prompt.remove();
                        }
                        if (isDropdown) {
                            module.verbose('Resetting dropdown value', $element, defaultValue);
                            $element.dropdown('clear');
                        } else if (isCheckbox) {
                            $field.prop('checked', false);
                        } else {
                            module.verbose('Resetting field value', $field, defaultValue);
                            $field.val('');
                        }
                    });
                },

                reset() {
                    $field.each(function() {
                        const $field = $(this);
                        const $element = $field.parent();
                        const $fieldGroup = $field.closest($group);
                        const $prompt = $fieldGroup.find(selector.prompt);
                        const defaultValue = $field.data(metadata.defaultValue);
                        const isCheckbox = $element.is(selector.uiCheckbox);
                        const isDropdown = $element.is(selector.uiDropdown);
                        const isErrored = $fieldGroup.hasClass(className.error);
                        if (defaultValue === undefined) {
                            return;
                        }
                        if (isErrored) {
                            module.verbose('Resetting error on field', $fieldGroup);
                            $fieldGroup.removeClass(className.error);
                            $prompt.remove();
                        }
                        if (isDropdown) {
                            module.verbose('Resetting dropdown value', $element, defaultValue);
                            $element.dropdown('restore defaults');
                        } else if (isCheckbox) {
                            module.verbose('Resetting checkbox value', $element, defaultValue);
                            $field.prop('checked', defaultValue);
                        } else {
                            module.verbose('Resetting field value', $field, defaultValue);
                            $field.val(defaultValue);
                        }
                    });
                },

                determine: {
                    isValid() {
                        let allValid = true;
                        $.each(validation, function(fieldName, field) {
                            if (!module.validate.field(field, fieldName, true)) {
                                allValid = false;
                            }
                        });
                        return allValid;
                    },
                },

                is: {
                    bracketedRule(rule) {
                        return rule.type && rule.type.match(settings.regExp.bracket);
                    },
                    shorthandFields(fields) {
                        const fieldKeys = Object.keys(fields);
                        const firstRule = fields[fieldKeys[0]];
                        return module.is.shorthandRules(firstRule);
                    },
                    // duck type rule test
                    shorthandRules(rules) {
                        return typeof rules === 'string' || $.isArray(rules);
                    },
                    empty($field) {
                        if (!$field || $field.length === 0) {
                            return true;
                        }
                        if ($field.is('input[type="checkbox"]')) {
                            return !$field.is(':checked');
                        }

                        return module.is.blank($field);
                    },
                    blank($field) {
                        return $.trim($field.val()) === '';
                    },
                    valid(field) {
                        let allValid = true;
                        if (field) {
                            module.verbose('Checking if field is valid', field);
                            return module.validate.field(validation[field], field, false);
                        }

                        module.verbose('Checking if form is valid');
                        $.each(validation, function(fieldName, field) {
                            if (!module.is.valid(fieldName)) {
                                allValid = false;
                            }
                        });
                        return allValid;
                    },
                },

                removeEvents() {
                    $module.off(eventNamespace);
                    $field.off(eventNamespace);
                    $submit.off(eventNamespace);
                    $field.off(eventNamespace);
                },

                event: {
                    field: {
                        keydown(event) {
                            const $field = $(this);
                            const key = event.which;
                            const isInput = $field.is(selector.input);
                            const isCheckbox = $field.is(selector.checkbox);
                            const isInDropdown = $field.closest(selector.uiDropdown).length > 0;
                            const keyCode = {
                                enter: 13,
                                escape: 27,
                            };
                            if (key == keyCode.escape) {
                                module.verbose('Escape key pressed blurring field');
                                $field.blur();
                            }
                            if (
                                !event.ctrlKey &&
                                key == keyCode.enter &&
                                isInput &&
                                !isInDropdown &&
                                !isCheckbox
                            ) {
                                if (!keyHeldDown) {
                                    $field.one(`keyup${eventNamespace}`, module.event.field.keyup);
                                    module.submit();
                                    module.debug('Enter pressed on input submitting form');
                                }
                                keyHeldDown = true;
                            }
                        },
                        keyup() {
                            keyHeldDown = false;
                        },
                        blur(event) {
                            const $field = $(this);
                            const $fieldGroup = $field.closest($group);
                            const validationRules = module.get.validation($field);
                            if ($fieldGroup.hasClass(className.error)) {
                                module.debug('Revalidating field', $field, validationRules);
                                if (validationRules) {
                                    module.validate.field(validationRules);
                                }
                            } else if (settings.on == 'blur') {
                                if (validationRules) {
                                    module.validate.field(validationRules);
                                }
                            }
                        },
                        change(event) {
                            const $field = $(this);
                            const $fieldGroup = $field.closest($group);
                            const validationRules = module.get.validation($field);
                            if (
                                validationRules &&
                                (settings.on == 'change' ||
                                    ($fieldGroup.hasClass(className.error) && settings.revalidate))
                            ) {
                                clearTimeout(module.timer);
                                module.timer = setTimeout(function() {
                                    module.debug(
                                        'Revalidating field',
                                        $field,
                                        module.get.validation($field)
                                    );
                                    module.validate.field(validationRules);
                                }, settings.delay);
                            }
                        },
                    },
                },

                get: {
                    ancillaryValue(rule) {
                        if (!rule.type || (!rule.value && !module.is.bracketedRule(rule))) {
                            return false;
                        }
                        return rule.value !== undefined
                            ? rule.value
                            : `${rule.type.match(settings.regExp.bracket)[1]}`;
                    },
                    ruleName(rule) {
                        if (module.is.bracketedRule(rule)) {
                            return rule.type.replace(
                                rule.type.match(settings.regExp.bracket)[0],
                                ''
                            );
                        }
                        return rule.type;
                    },
                    changeEvent(type, $input) {
                        if (
                            type == 'checkbox' ||
                            type == 'radio' ||
                            type == 'hidden' ||
                            $input.is('select')
                        ) {
                            return 'change';
                        }

                        return module.get.inputEvent();
                    },
                    inputEvent() {
                        return document.createElement('input').oninput !== undefined
                            ? 'input'
                            : document.createElement('input').onpropertychange !== undefined
                            ? 'propertychange'
                            : 'keyup';
                    },
                    fieldsFromShorthand(fields) {
                        const fullFields = {};
                        $.each(fields, function(name, rules) {
                            if (typeof rules === 'string') {
                                rules = [rules];
                            }
                            fullFields[name] = {
                                rules: [],
                            };
                            $.each(rules, function(index, rule) {
                                fullFields[name].rules.push({ type: rule });
                            });
                        });
                        return fullFields;
                    },
                    prompt(rule, field) {
                        const ruleName = module.get.ruleName(rule);
                        const ancillary = module.get.ancillaryValue(rule);
                        const $field = module.get.field(field.identifier);
                        const value = $field.val();
                        let prompt = $.isFunction(rule.prompt)
                            ? rule.prompt(value)
                            : rule.prompt ||
                              settings.prompt[ruleName] ||
                              settings.text.unspecifiedRule;
                        const requiresValue = prompt.search('{value}') !== -1;
                        const requiresName = prompt.search('{name}') !== -1;
                        let $label;
                        let name;
                        if (requiresValue) {
                            prompt = prompt.replace('{value}', $field.val());
                        }
                        if (requiresName) {
                            $label = $field
                                .closest(selector.group)
                                .find('label')
                                .eq(0);
                            name =
                                $label.length == 1
                                    ? $label.text()
                                    : $field.prop('placeholder') || settings.text.unspecifiedField;
                            prompt = prompt.replace('{name}', name);
                        }
                        prompt = prompt.replace('{identifier}', field.identifier);
                        prompt = prompt.replace('{ruleValue}', ancillary);
                        if (!rule.prompt) {
                            module.verbose(
                                'Using default validation prompt for type',
                                prompt,
                                ruleName
                            );
                        }
                        return prompt;
                    },
                    settings() {
                        if ($.isPlainObject(parameters)) {
                            const keys = Object.keys(parameters);
                            const isLegacySettings =
                                keys.length > 0
                                    ? parameters[keys[0]].identifier !== undefined &&
                                      parameters[keys[0]].rules !== undefined
                                    : false;
                            let ruleKeys;
                            if (isLegacySettings) {
                                // 1.x (ducktyped)
                                settings = $.extend(true, {}, $.fn.form.settings, legacyParameters);
                                validation = $.extend({}, $.fn.form.settings.defaults, parameters);
                                module.error(settings.error.oldSyntax, element);
                                module.verbose(
                                    'Extending settings from legacy parameters',
                                    validation,
                                    settings
                                );
                            } else {
                                // 2.x
                                if (
                                    parameters.fields &&
                                    module.is.shorthandFields(parameters.fields)
                                ) {
                                    parameters.fields = module.get.fieldsFromShorthand(
                                        parameters.fields
                                    );
                                }
                                settings = $.extend(true, {}, $.fn.form.settings, parameters);
                                validation = $.extend(
                                    {},
                                    $.fn.form.settings.defaults,
                                    settings.fields
                                );
                                module.verbose('Extending settings', validation, settings);
                            }
                        } else {
                            settings = $.fn.form.settings;
                            validation = $.fn.form.settings.defaults;
                            module.verbose('Using default form validation', validation, settings);
                        }

                        // shorthand
                        namespace = settings.namespace;
                        metadata = settings.metadata;
                        selector = settings.selector;
                        className = settings.className;
                        regExp = settings.regExp;
                        error = settings.error;
                        moduleNamespace = `module-${namespace}`;
                        eventNamespace = `.${namespace}`;

                        // grab instance
                        instance = $module.data(moduleNamespace);

                        // refresh selector cache
                        module.refresh();
                    },
                    field(identifier) {
                        module.verbose('Finding field with identifier', identifier);
                        identifier = module.escape.string(identifier);
                        if ($field.filter(`#${identifier}`).length > 0) {
                            return $field.filter(`#${identifier}`);
                        }
                        if ($field.filter(`[name="${identifier}"]`).length > 0) {
                            return $field.filter(`[name="${identifier}"]`);
                        }
                        if ($field.filter(`[name="${identifier}[]"]`).length > 0) {
                            return $field.filter(`[name="${identifier}[]"]`);
                        }
                        if (
                            $field.filter(`[data-${metadata.validate}="${identifier}"]`).length > 0
                        ) {
                            return $field.filter(`[data-${metadata.validate}="${identifier}"]`);
                        }
                        return $('<input/>');
                    },
                    fields(fields) {
                        let $fields = $();
                        $.each(fields, function(index, name) {
                            $fields = $fields.add(module.get.field(name));
                        });
                        return $fields;
                    },
                    validation($field) {
                        let fieldValidation;
                        let identifier;
                        if (!validation) {
                            return false;
                        }
                        $.each(validation, function(fieldName, field) {
                            identifier = field.identifier || fieldName;
                            if (module.get.field(identifier)[0] == $field[0]) {
                                field.identifier = identifier;
                                fieldValidation = field;
                            }
                        });
                        return fieldValidation || false;
                    },
                    value(field) {
                        const fields = [];
                        let results;
                        fields.push(field);
                        results = module.get.values.call(element, fields);
                        return results[field];
                    },
                    values(fields) {
                        const $fields = $.isArray(fields) ? module.get.fields(fields) : $field;
                        const values = {};
                        $fields.each(function(index, field) {
                            const $field = $(field);
                            const type = $field.prop('type');
                            let name = $field.prop('name');
                            const value = $field.val();
                            const isCheckbox = $field.is(selector.checkbox);
                            const isRadio = $field.is(selector.radio);
                            const isMultiple = name.indexOf('[]') !== -1;
                            const isChecked = isCheckbox ? $field.is(':checked') : false;
                            if (name) {
                                if (isMultiple) {
                                    name = name.replace('[]', '');
                                    if (!values[name]) {
                                        values[name] = [];
                                    }
                                    if (isCheckbox) {
                                        if (isChecked) {
                                            values[name].push(value || true);
                                        } else {
                                            values[name].push(false);
                                        }
                                    } else {
                                        values[name].push(value);
                                    }
                                } else if (isRadio) {
                                    if (values[name] === undefined || values[name] == false) {
                                        values[name] = isChecked ? value || true : false;
                                    }
                                } else if (isCheckbox) {
                                    if (isChecked) {
                                        values[name] = value || true;
                                    } else {
                                        values[name] = false;
                                    }
                                } else {
                                    values[name] = value;
                                }
                            }
                        });
                        return values;
                    },
                },

                has: {
                    field(identifier) {
                        module.verbose(
                            'Checking for existence of a field with identifier',
                            identifier
                        );
                        identifier = module.escape.string(identifier);
                        if (typeof identifier !== 'string') {
                            module.error(error.identifier, identifier);
                        }
                        if ($field.filter(`#${identifier}`).length > 0) {
                            return true;
                        }
                        if ($field.filter(`[name="${identifier}"]`).length > 0) {
                            return true;
                        }
                        if (
                            $field.filter(`[data-${metadata.validate}="${identifier}"]`).length > 0
                        ) {
                            return true;
                        }
                        return false;
                    },
                },

                escape: {
                    string(text) {
                        text = String(text);
                        return text.replace(regExp.escape, '\\$&');
                    },
                },

                add: {
                    // alias
                    rule(name, rules) {
                        module.add.field(name, rules);
                    },
                    field(name, rules) {
                        const newValidation = {};
                        if (module.is.shorthandRules(rules)) {
                            rules = $.isArray(rules) ? rules : [rules];
                            newValidation[name] = {
                                rules: [],
                            };
                            $.each(rules, function(index, rule) {
                                newValidation[name].rules.push({ type: rule });
                            });
                        } else {
                            newValidation[name] = rules;
                        }
                        validation = $.extend({}, validation, newValidation);
                        module.debug('Adding rules', newValidation, validation);
                    },
                    fields(fields) {
                        let newValidation;
                        if (fields && module.is.shorthandFields(fields)) {
                            newValidation = module.get.fieldsFromShorthand(fields);
                        } else {
                            newValidation = fields;
                        }
                        validation = $.extend({}, validation, newValidation);
                    },
                    prompt(identifier, errors) {
                        const $field = module.get.field(identifier);
                        const $fieldGroup = $field.closest($group);
                        let $prompt = $fieldGroup.children(selector.prompt);
                        const promptExists = $prompt.length !== 0;
                        errors = typeof errors === 'string' ? [errors] : errors;
                        module.verbose('Adding field error state', identifier);
                        $fieldGroup.addClass(className.error);
                        if (settings.inline) {
                            if (!promptExists) {
                                $prompt = settings.templates.prompt(errors);
                                $prompt.appendTo($fieldGroup);
                            }
                            $prompt.html(errors[0]);
                            if (!promptExists) {
                                if (
                                    settings.transition &&
                                    $.fn.transition !== undefined &&
                                    $module.transition('is supported')
                                ) {
                                    module.verbose(
                                        'Displaying error with css transition',
                                        settings.transition
                                    );
                                    $prompt.transition(
                                        `${settings.transition} in`,
                                        settings.duration
                                    );
                                } else {
                                    module.verbose(
                                        'Displaying error with fallback javascript animation'
                                    );
                                    $prompt.fadeIn(settings.duration);
                                }
                            } else {
                                module.verbose(
                                    'Inline errors are disabled, no inline error added',
                                    identifier
                                );
                            }
                        }
                    },
                    errors(errors) {
                        module.debug('Adding form error messages', errors);
                        module.set.error();
                        $message.html(settings.templates.error(errors));
                    },
                },

                remove: {
                    rule(field, rule) {
                        const rules = $.isArray(rule) ? rule : [rule];
                        if (rule == undefined) {
                            module.debug('Removed all rules');
                            validation[field].rules = [];
                            return;
                        }
                        if (validation[field] == undefined || !$.isArray(validation[field].rules)) {
                            return;
                        }
                        $.each(validation[field].rules, function(index, rule) {
                            if (rules.indexOf(rule.type) !== -1) {
                                module.debug('Removed rule', rule.type);
                                validation[field].rules.splice(index, 1);
                            }
                        });
                    },
                    field(field) {
                        const fields = $.isArray(field) ? field : [field];
                        $.each(fields, function(index, field) {
                            module.remove.rule(field);
                        });
                    },
                    // alias
                    rules(field, rules) {
                        if ($.isArray(field)) {
                            $.each(fields, function(index, field) {
                                module.remove.rule(field, rules);
                            });
                        } else {
                            module.remove.rule(field, rules);
                        }
                    },
                    fields(fields) {
                        module.remove.field(fields);
                    },
                    prompt(identifier) {
                        const $field = module.get.field(identifier);
                        const $fieldGroup = $field.closest($group);
                        const $prompt = $fieldGroup.children(selector.prompt);
                        $fieldGroup.removeClass(className.error);
                        if (settings.inline && $prompt.is(':visible')) {
                            module.verbose('Removing prompt for field', identifier);
                            if (
                                settings.transition &&
                                $.fn.transition !== undefined &&
                                $module.transition('is supported')
                            ) {
                                $prompt.transition(
                                    `${settings.transition} out`,
                                    settings.duration,
                                    function() {
                                        $prompt.remove();
                                    }
                                );
                            } else {
                                $prompt.fadeOut(settings.duration, function() {
                                    $prompt.remove();
                                });
                            }
                        }
                    },
                },

                set: {
                    success() {
                        $module.removeClass(className.error).addClass(className.success);
                    },
                    defaults() {
                        $field.each(function() {
                            const $field = $(this);
                            const isCheckbox = $field.filter(selector.checkbox).length > 0;
                            const value = isCheckbox ? $field.is(':checked') : $field.val();
                            $field.data(metadata.defaultValue, value);
                        });
                    },
                    error() {
                        $module.removeClass(className.success).addClass(className.error);
                    },
                    value(field, value) {
                        const fields = {};
                        fields[field] = value;
                        return module.set.values.call(element, fields);
                    },
                    values(fields) {
                        if ($.isEmptyObject(fields)) {
                            return;
                        }
                        $.each(fields, function(key, value) {
                            const $field = module.get.field(key);
                            let $element = $field.parent();
                            const isMultiple = $.isArray(value);
                            const isCheckbox = $element.is(selector.uiCheckbox);
                            const isDropdown = $element.is(selector.uiDropdown);
                            const isRadio = $field.is(selector.radio) && isCheckbox;
                            const fieldExists = $field.length > 0;
                            let $multipleField;
                            if (fieldExists) {
                                if (isMultiple && isCheckbox) {
                                    module.verbose('Selecting multiple', value, $field);
                                    $element.checkbox('uncheck');
                                    $.each(value, function(index, value) {
                                        $multipleField = $field.filter(`[value="${value}"]`);
                                        $element = $multipleField.parent();
                                        if ($multipleField.length > 0) {
                                            $element.checkbox('check');
                                        }
                                    });
                                } else if (isRadio) {
                                    module.verbose('Selecting radio value', value, $field);
                                    $field
                                        .filter(`[value="${value}"]`)
                                        .parent(selector.uiCheckbox)
                                        .checkbox('check');
                                } else if (isCheckbox) {
                                    module.verbose('Setting checkbox value', value, $element);
                                    if (value === true) {
                                        $element.checkbox('check');
                                    } else {
                                        $element.checkbox('uncheck');
                                    }
                                } else if (isDropdown) {
                                    module.verbose('Setting dropdown value', value, $element);
                                    $element.dropdown('set selected', value);
                                } else {
                                    module.verbose('Setting field value', value, $field);
                                    $field.val(value);
                                }
                            }
                        });
                    },
                },

                validate: {
                    form(event, ignoreCallbacks) {
                        const values = module.get.values();
                        let apiRequest;
                        // input keydown event will fire submit repeatedly by browser default
                        if (keyHeldDown) {
                            return false;
                        }

                        // reset errors
                        formErrors = [];
                        if (module.determine.isValid()) {
                            module.debug('Form has no validation errors, submitting');
                            module.set.success();
                            if (ignoreCallbacks !== true) {
                                return settings.onSuccess.call(element, event, values);
                            }
                        } else {
                            module.debug('Form has errors');
                            module.set.error();
                            if (!settings.inline) {
                                module.add.errors(formErrors);
                            }
                            // prevent ajax submit
                            if ($module.data('moduleApi') !== undefined) {
                                event.stopImmediatePropagation();
                            }
                            if (ignoreCallbacks !== true) {
                                return settings.onFailure.call(element, formErrors, values);
                            }
                        }
                    },

                    // takes a validation object and returns whether field passes validation
                    field(field, fieldName, showErrors) {
                        showErrors = showErrors !== undefined ? showErrors : true;
                        if (typeof field === 'string') {
                            module.verbose('Validating field', field);
                            fieldName = field;
                            field = validation[field];
                        }
                        const identifier = field.identifier || fieldName;
                        const $field = module.get.field(identifier);
                        const $dependsField = field.depends
                            ? module.get.field(field.depends)
                            : false;
                        let fieldValid = true;
                        const fieldErrors = [];
                        if (!field.identifier) {
                            module.debug('Using field name as identifier', identifier);
                            field.identifier = identifier;
                        }
                        if ($field.prop('disabled')) {
                            module.debug('Field is disabled. Skipping', identifier);
                            fieldValid = true;
                        } else if (field.optional && module.is.blank($field)) {
                            module.debug('Field is optional and blank. Skipping', identifier);
                            fieldValid = true;
                        } else if (field.depends && module.is.empty($dependsField)) {
                            module.debug(
                                'Field depends on another value that is not present or empty. Skipping',
                                $dependsField
                            );
                            fieldValid = true;
                        } else if (field.rules !== undefined) {
                            $.each(field.rules, function(index, rule) {
                                if (
                                    module.has.field(identifier) &&
                                    !module.validate.rule(field, rule)
                                ) {
                                    module.debug('Field is invalid', identifier, rule.type);
                                    fieldErrors.push(module.get.prompt(rule, field));
                                    fieldValid = false;
                                }
                            });
                        }
                        if (fieldValid) {
                            if (showErrors) {
                                module.remove.prompt(identifier, fieldErrors);
                                settings.onValid.call($field);
                            }
                        } else {
                            if (showErrors) {
                                formErrors = formErrors.concat(fieldErrors);
                                module.add.prompt(identifier, fieldErrors);
                                settings.onInvalid.call($field, fieldErrors);
                            }
                            return false;
                        }
                        return true;
                    },

                    // takes validation rule and returns whether field passes rule
                    rule(field, rule) {
                        const $field = module.get.field(field.identifier);
                        const { type } = rule;
                        let value = $field.val();
                        const isValid = true;
                        const ancillary = module.get.ancillaryValue(rule);
                        const ruleName = module.get.ruleName(rule);
                        const ruleFunction = settings.rules[ruleName];
                        if (!$.isFunction(ruleFunction)) {
                            module.error(error.noRule, ruleName);
                            return;
                        }
                        // cast to string avoiding encoding special values
                        value =
                            value === undefined || value === '' || value === null
                                ? ''
                                : $.trim(`${value}`);
                        return ruleFunction.call($field, value, ancillary);
                    },
                },

                setting(name, value) {
                    if ($.isPlainObject(name)) {
                        $.extend(true, settings, name);
                    } else if (value !== undefined) {
                        settings[name] = value;
                    } else {
                        return settings[name];
                    }
                },
                internal(name, value) {
                    if ($.isPlainObject(name)) {
                        $.extend(true, module, name);
                    } else if (value !== undefined) {
                        module[name] = value;
                    } else {
                        return module[name];
                    }
                },
                debug() {
                    if (!settings.silent && settings.debug) {
                        if (settings.performance) {
                            module.performance.log(arguments);
                        } else {
                            module.debug = Function.prototype.bind.call(
                                console.info,
                                console,
                                `${settings.name}:`
                            );
                            module.debug.apply(console, arguments);
                        }
                    }
                },
                verbose() {
                    if (!settings.silent && settings.verbose && settings.debug) {
                        if (settings.performance) {
                            module.performance.log(arguments);
                        } else {
                            module.verbose = Function.prototype.bind.call(
                                console.info,
                                console,
                                `${settings.name}:`
                            );
                            module.verbose.apply(console, arguments);
                        }
                    }
                },
                error() {
                    if (!settings.silent) {
                        module.error = Function.prototype.bind.call(
                            console.error,
                            console,
                            `${settings.name}:`
                        );
                        module.error.apply(console, arguments);
                    }
                },
                performance: {
                    log(message) {
                        let currentTime;
                        let executionTime;
                        let previousTime;
                        if (settings.performance) {
                            currentTime = new Date().getTime();
                            previousTime = time || currentTime;
                            executionTime = currentTime - previousTime;
                            time = currentTime;
                            performance.push({
                                Name: message[0],
                                Arguments: [].slice.call(message, 1) || '',
                                Element: element,
                                'Execution Time': executionTime,
                            });
                        }
                        clearTimeout(module.performance.timer);
                        module.performance.timer = setTimeout(module.performance.display, 500);
                    },
                    display() {
                        let title = `${settings.name}:`;
                        let totalTime = 0;
                        time = false;
                        clearTimeout(module.performance.timer);
                        $.each(performance, function(index, data) {
                            totalTime += data['Execution Time'];
                        });
                        title += ` ${totalTime}ms`;
                        if (moduleSelector) {
                            title += ` '${moduleSelector}'`;
                        }
                        if ($allModules.length > 1) {
                            title += `${' ' + '('}${$allModules.length})`;
                        }
                        if (
                            (console.group !== undefined || console.table !== undefined) &&
                            performance.length > 0
                        ) {
                            console.groupCollapsed(title);
                            if (console.table) {
                                console.table(performance);
                            } else {
                                $.each(performance, function(index, data) {
                                    console.log(`${data.Name}: ${data['Execution Time']}ms`);
                                });
                            }
                            console.groupEnd();
                        }
                        performance = [];
                    },
                },
                invoke(query, passedArguments, context) {
                    let object = instance;
                    let maxDepth;
                    let found;
                    let response;
                    passedArguments = passedArguments || queryArguments;
                    context = element || context;
                    if (typeof query === 'string' && object !== undefined) {
                        query = query.split(/[\. ]/);
                        maxDepth = query.length - 1;
                        $.each(query, function(depth, value) {
                            const camelCaseValue =
                                depth != maxDepth
                                    ? value +
                                      query[depth + 1].charAt(0).toUpperCase() +
                                      query[depth + 1].slice(1)
                                    : query;
                            if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth) {
                                object = object[camelCaseValue];
                            } else if (object[camelCaseValue] !== undefined) {
                                found = object[camelCaseValue];
                                return false;
                            } else if ($.isPlainObject(object[value]) && depth != maxDepth) {
                                object = object[value];
                            } else if (object[value] !== undefined) {
                                found = object[value];
                                return false;
                            } else {
                                return false;
                            }
                        });
                    }
                    if ($.isFunction(found)) {
                        response = found.apply(context, passedArguments);
                    } else if (found !== undefined) {
                        response = found;
                    }
                    if ($.isArray(returnedValue)) {
                        returnedValue.push(response);
                    } else if (returnedValue !== undefined) {
                        returnedValue = [returnedValue, response];
                    } else if (response !== undefined) {
                        returnedValue = response;
                    }
                    return found;
                },
            };
            module.initialize();
        });

        return returnedValue !== undefined ? returnedValue : this;
    };

    $.fn.form.settings = {
        name: 'Form',
        namespace: 'form',

        debug: false,
        verbose: false,
        performance: true,

        fields: false,

        keyboardShortcuts: true,
        on: 'submit',
        inline: false,

        delay: 200,
        revalidate: true,

        transition: 'scale',
        duration: 200,

        onValid() {},
        onInvalid() {},
        onSuccess() {
            return true;
        },
        onFailure() {
            return false;
        },

        metadata: {
            defaultValue: 'default',
            validate: 'validate',
        },

        regExp: {
            htmlID: /^[a-zA-Z][\w:.-]*$/g,
            bracket: /\[(.*)\]/i,
            decimal: /^\d+\.?\d*$/,
            email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
            escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            flags: /^\/(.*)\/(.*)?/,
            integer: /^\-?\d+$/,
            number: /^\-?\d*(\.\d+)?$/,
            url: /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i,
        },

        text: {
            unspecifiedRule: 'Please enter a valid value',
            unspecifiedField: 'This field',
        },

        prompt: {
            empty: '{name} must have a value',
            checked: '{name} must be checked',
            email: '{name} must be a valid e-mail',
            url: '{name} must be a valid url',
            regExp: '{name} is not formatted correctly',
            integer: '{name} must be an integer',
            decimal: '{name} must be a decimal number',
            number: '{name} must be set to a number',
            is: '{name} must be "{ruleValue}"',
            isExactly: '{name} must be exactly "{ruleValue}"',
            not: '{name} cannot be set to "{ruleValue}"',
            notExactly: '{name} cannot be set to exactly "{ruleValue}"',
            contain: '{name} must contain "{ruleValue}"',
            containExactly: '{name} must contain exactly "{ruleValue}"',
            doesntContain: '{name} cannot contain  "{ruleValue}"',
            doesntContainExactly: '{name} cannot contain exactly "{ruleValue}"',
            minLength: '{name} must be at least {ruleValue} characters',
            length: '{name} must be at least {ruleValue} characters',
            exactLength: '{name} must be exactly {ruleValue} characters',
            maxLength: '{name} cannot be longer than {ruleValue} characters',
            match: '{name} must match {ruleValue} field',
            different: '{name} must have a different value than {ruleValue} field',
            creditCard: '{name} must be a valid credit card number',
            minCount: '{name} must have at least {ruleValue} choices',
            exactCount: '{name} must have exactly {ruleValue} choices',
            maxCount: '{name} must have {ruleValue} or less choices',
        },

        selector: {
            checkbox: 'input[type="checkbox"], input[type="radio"]',
            clear: '.clear',
            field: 'input, textarea, select',
            group: '.field',
            input: 'input',
            message: '.error.message',
            prompt: '.prompt.label',
            radio: 'input[type="radio"]',
            reset: '.reset:not([type="reset"])',
            submit: '.submit:not([type="submit"])',
            uiCheckbox: '.ui.checkbox',
            uiDropdown: '.ui.dropdown',
        },

        className: {
            error: 'error',
            label: 'ui prompt label',
            pressed: 'down',
            success: 'success',
        },

        error: {
            identifier: 'You must specify a string identifier for each field',
            method: 'The method you called is not defined.',
            noRule: 'There is no rule matching the one you specified',
            oldSyntax:
                'Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically.',
        },

        templates: {
            // template that produces error message
            error(errors) {
                let html = '<ul class="list">';
                $.each(errors, function(index, value) {
                    html += `<li>${value}</li>`;
                });
                html += '</ul>';
                return $(html);
            },

            // template that produces label
            prompt(errors) {
                return $('<div/>')
                    .addClass('ui basic red pointing prompt label')
                    .html(errors[0]);
            },
        },

        rules: {
            // is not empty or blank string
            empty(value) {
                return !(
                    value === undefined ||
                    value === '' ||
                    ($.isArray(value) && value.length === 0)
                );
            },

            // checkbox checked
            checked() {
                return $(this).filter(':checked').length > 0;
            },

            // is most likely an email
            email(value) {
                return $.fn.form.settings.regExp.email.test(value);
            },

            // value is most likely url
            url(value) {
                return $.fn.form.settings.regExp.url.test(value);
            },

            // matches specified regExp
            regExp(value, regExp) {
                if (regExp instanceof RegExp) {
                    return value.match(regExp);
                }
                const regExpParts = regExp.match($.fn.form.settings.regExp.flags);
                let flags;
                // regular expression specified as /baz/gi (flags)
                if (regExpParts) {
                    regExp = regExpParts.length >= 2 ? regExpParts[1] : regExp;
                    flags = regExpParts.length >= 3 ? regExpParts[2] : '';
                }
                return value.match(new RegExp(regExp, flags));
            },

            // is valid integer or matches range
            integer(value, range) {
                const intRegExp = $.fn.form.settings.regExp.integer;
                let min;
                let max;
                let parts;
                if (!range || ['', '..'].indexOf(range) !== -1) {
                    // do nothing
                } else if (range.indexOf('..') == -1) {
                    if (intRegExp.test(range)) {
                        min = max = range - 0;
                    }
                } else {
                    parts = range.split('..', 2);
                    if (intRegExp.test(parts[0])) {
                        min = parts[0] - 0;
                    }
                    if (intRegExp.test(parts[1])) {
                        max = parts[1] - 0;
                    }
                }
                return (
                    intRegExp.test(value) &&
                    (min === undefined || value >= min) &&
                    (max === undefined || value <= max)
                );
            },

            // is valid number (with decimal)
            decimal(value) {
                return $.fn.form.settings.regExp.decimal.test(value);
            },

            // is valid number
            number(value) {
                return $.fn.form.settings.regExp.number.test(value);
            },

            // is value (case insensitive)
            is(value, text) {
                text = typeof text === 'string' ? text.toLowerCase() : text;
                value = typeof value === 'string' ? value.toLowerCase() : value;
                return value == text;
            },

            // is value
            isExactly(value, text) {
                return value == text;
            },

            // value is not another value (case insensitive)
            not(value, notValue) {
                value = typeof value === 'string' ? value.toLowerCase() : value;
                notValue = typeof notValue === 'string' ? notValue.toLowerCase() : notValue;
                return value != notValue;
            },

            // value is not another value (case sensitive)
            notExactly(value, notValue) {
                return value != notValue;
            },

            // value contains text (insensitive)
            contains(value, text) {
                // escape regex characters
                text = text.replace($.fn.form.settings.regExp.escape, '\\$&');
                return value.search(new RegExp(text, 'i')) !== -1;
            },

            // value contains text (case sensitive)
            containsExactly(value, text) {
                // escape regex characters
                text = text.replace($.fn.form.settings.regExp.escape, '\\$&');
                return value.search(new RegExp(text)) !== -1;
            },

            // value contains text (insensitive)
            doesntContain(value, text) {
                // escape regex characters
                text = text.replace($.fn.form.settings.regExp.escape, '\\$&');
                return value.search(new RegExp(text, 'i')) === -1;
            },

            // value contains text (case sensitive)
            doesntContainExactly(value, text) {
                // escape regex characters
                text = text.replace($.fn.form.settings.regExp.escape, '\\$&');
                return value.search(new RegExp(text)) === -1;
            },

            // is at least string length
            minLength(value, requiredLength) {
                return value !== undefined ? value.length >= requiredLength : false;
            },

            // see rls notes for 2.0.6 (this is a duplicate of minLength)
            length(value, requiredLength) {
                return value !== undefined ? value.length >= requiredLength : false;
            },

            // is exactly length
            exactLength(value, requiredLength) {
                return value !== undefined ? value.length == requiredLength : false;
            },

            // is less than length
            maxLength(value, maxLength) {
                return value !== undefined ? value.length <= maxLength : false;
            },

            // matches another field
            match(value, identifier) {
                const $form = $(this);
                let matchingValue;
                if ($(`[data-validate="${identifier}"]`).length > 0) {
                    matchingValue = $(`[data-validate="${identifier}"]`).val();
                } else if ($(`#${identifier}`).length > 0) {
                    matchingValue = $(`#${identifier}`).val();
                } else if ($(`[name="${identifier}"]`).length > 0) {
                    matchingValue = $(`[name="${identifier}"]`).val();
                } else if ($(`[name="${identifier}[]"]`).length > 0) {
                    matchingValue = $(`[name="${identifier}[]"]`);
                }
                return matchingValue !== undefined
                    ? value.toString() == matchingValue.toString()
                    : false;
            },

            // different than another field
            different(value, identifier) {
                // use either id or name of field
                const $form = $(this);
                let matchingValue;
                if ($(`[data-validate="${identifier}"]`).length > 0) {
                    matchingValue = $(`[data-validate="${identifier}"]`).val();
                } else if ($(`#${identifier}`).length > 0) {
                    matchingValue = $(`#${identifier}`).val();
                } else if ($(`[name="${identifier}"]`).length > 0) {
                    matchingValue = $(`[name="${identifier}"]`).val();
                } else if ($(`[name="${identifier}[]"]`).length > 0) {
                    matchingValue = $(`[name="${identifier}[]"]`);
                }
                return matchingValue !== undefined
                    ? value.toString() !== matchingValue.toString()
                    : false;
            },

            creditCard(cardNumber, cardTypes) {
                const cards = {
                    visa: {
                        pattern: /^4/,
                        length: [16],
                    },
                    amex: {
                        pattern: /^3[47]/,
                        length: [15],
                    },
                    mastercard: {
                        pattern: /^5[1-5]/,
                        length: [16],
                    },
                    discover: {
                        pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
                        length: [16],
                    },
                    unionPay: {
                        pattern: /^(62|88)/,
                        length: [16, 17, 18, 19],
                    },
                    jcb: {
                        pattern: /^35(2[89]|[3-8][0-9])/,
                        length: [16],
                    },
                    maestro: {
                        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
                        length: [12, 13, 14, 15, 16, 17, 18, 19],
                    },
                    dinersClub: {
                        pattern: /^(30[0-5]|^36)/,
                        length: [14],
                    },
                    laser: {
                        pattern: /^(6304|670[69]|6771)/,
                        length: [16, 17, 18, 19],
                    },
                    visaElectron: {
                        pattern: /^(4026|417500|4508|4844|491(3|7))/,
                        length: [16],
                    },
                };
                let valid = {};
                let validCard = false;
                const requiredTypes = typeof cardTypes === 'string' ? cardTypes.split(',') : false;
                let unionPay;
                let validation;

                if (typeof cardNumber !== 'string' || cardNumber.length === 0) {
                    return;
                }

                // allow dashes in card
                cardNumber = cardNumber.replace(/[\-]/g, '');

                // verify card types
                if (requiredTypes) {
                    $.each(requiredTypes, function(index, type) {
                        // verify each card type
                        validation = cards[type];
                        if (validation) {
                            valid = {
                                length: $.inArray(cardNumber.length, validation.length) !== -1,
                                pattern: cardNumber.search(validation.pattern) !== -1,
                            };
                            if (valid.length && valid.pattern) {
                                validCard = true;
                            }
                        }
                    });

                    if (!validCard) {
                        return false;
                    }
                }

                // skip luhn for UnionPay
                unionPay = {
                    number: $.inArray(cardNumber.length, cards.unionPay.length) !== -1,
                    pattern: cardNumber.search(cards.unionPay.pattern) !== -1,
                };
                if (unionPay.number && unionPay.pattern) {
                    return true;
                }

                // verify luhn, adapted from  <https://gist.github.com/2134376>
                let { length } = cardNumber;
                let multiple = 0;
                const producedValue = [
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
                ];
                let sum = 0;
                while (length--) {
                    sum += producedValue[multiple][parseInt(cardNumber.charAt(length), 10)];
                    multiple ^= 1;
                }
                return sum % 10 === 0 && sum > 0;
            },

            minCount(value, minCount) {
                if (minCount == 0) {
                    return true;
                }
                if (minCount == 1) {
                    return value !== '';
                }
                return value.split(',').length >= minCount;
            },

            exactCount(value, exactCount) {
                if (exactCount == 0) {
                    return value === '';
                }
                if (exactCount == 1) {
                    return value !== '' && value.search(',') === -1;
                }
                return value.split(',').length == exactCount;
            },

            maxCount(value, maxCount) {
                if (maxCount == 0) {
                    return false;
                }
                if (maxCount == 1) {
                    return value.search(',') === -1;
                }
                return value.split(',').length <= maxCount;
            },
        },
    };
})(jQuery, window, document);
