import ApiResponse from '@/misc/ApiResponse';

describe('ApiResponse', () => {
  it('should set its fields to the values passed to the constructor', () => {
    const param1 = true;
    const param2 = 'stuff';
    const response = new ApiResponse<typeof param2>(param1, param2);

    expect(response.success).toEqual(param1);
    expect(response.value).toEqual(param2);
  });
});
