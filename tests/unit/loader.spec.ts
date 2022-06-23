import path from 'path';
import compliler from '../helper/compliler';

describe('Loader', () => {
  it('generates correctly.', async () => {
    const resultStr = compliler(path.resolve(__dirname, '../fixture/Select.tsx')).replace('module.exports = ', '');
    const result = JSON.parse(resultStr);
    expect(result.description).toContain('和原生的 Antd Select 相比多了以下功能');
    expect(result.displayName).toBe('Select');
    expect(result.props.options.required).toBe(true);
    expect(result.props.options.tsType.name).toBe('OptionsType');
    expect(result.props.options.description).toContain('用 options 结构代替 Select.Option 组件');
    expect(result.props.hasSelectAll.required).toBe(false);
    expect(result.props.hasSelectAll.tsType.name).toBe('boolean');
    expect(result.props.hasSelectAll.description).toContain(
      '是否有全选，只有 mode=multiple 和 options 配置的模式才有效\n只支持非 optGroup 的'
    );
  });
});
