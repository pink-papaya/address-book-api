export default class ApiResponse<T> {
  success: boolean;

  value?: T;

  constructor(success: boolean, value?: T) {
    this.success = success;
    this.value = value;
  }
}
