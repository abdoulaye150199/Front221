import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}

export class FormBuilderUtils {
  constructor(private fb: NonNullableFormBuilder) {}

  createFormGroup<T extends Record<string, any>>(
    controls: { [K in keyof T]: T[K] | FormControl<T[K]> }
  ): FormGroup {
    return this.fb.group(controls) as unknown as FormGroup;
  }

  createFormControl<T>(value: T, validators: any[] = []): FormControl<T> {
    return new FormControl<T>(value, { nonNullable: true, validators });
  }
}

export class FormResetUtils {
  static resetFormFields(form: any, defaultValues: any = {}): void {
    Object.keys(form).forEach(key => {
      if (form[key] instanceof FormControl) {
        form[key].setValue(defaultValues[key] || '');
      } else if (typeof form[key] === 'object' && form[key] !== null) {
        this.resetFormFields(form[key], defaultValues[key] || {});
      }
    });
  }

  static resetFormGroup(formGroup: FormGroup): void {
    formGroup.reset();
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.setValue('');
    });
  }
}

export class FormValidationUtils {
  static hasRequiredTextValues(...values: any[]): boolean {
    return values.every(value => 
      value !== null && 
      value !== undefined && 
      String(value).trim().length > 0
    );
  }

  static hasRequiredValues(...values: any[]): boolean {
    return values.every(value => 
      value !== null && 
      value !== undefined
    );
  }

  static isFormValid(form: FormGroup): boolean {
    return form.valid === true;
  }

  static markFormAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsTouched();
    });
  }
}

export interface FormState {
  isSubmitting: boolean;
  isEditing: boolean;
  editingItemId: string | null;
  openActionId: string | null;
}

export class FormStateManager {
  state: FormState = {
    isSubmitting: false,
    isEditing: false,
    editingItemId: null,
    openActionId: null,
  };

  startEditing(itemId: string): void {
    this.state.editingItemId = itemId;
    this.state.openActionId = null;
    this.state.isEditing = true;
  }

  stopEditing(): void {
    this.state.editingItemId = null;
    this.state.isEditing = false;
  }

  toggleActionMenu(itemId: string): void {
    this.state.openActionId = this.state.openActionId === itemId ? null : itemId;
  }

  closeActionMenu(): void {
    this.state.openActionId = null;
  }

  reset(): void {
    this.state = {
      isSubmitting: false,
      isEditing: false,
      editingItemId: null,
      openActionId: null,
    };
  }
}