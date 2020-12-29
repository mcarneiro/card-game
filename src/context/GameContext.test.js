import {getIconAssets} from './GameContext'
test('get icon assets', () => {
  const assetList = [
    {label: 'a', url: 'url-a'},
    {label: 'b', url: 'url-b'}
  ]
  let result = getIconAssets(['a', 'b', 'c'], assetList)

  expect(result[0].url).toBe('url-a')
  expect(result[1].url).toBe('url-b')
  expect(result[2]).toBe('c')

  result = getIconAssets('a', assetList)
  expect(result[0].url).toBe('url-a')

  result = getIconAssets('a', [])
  expect(result[0]).toBe('a')
  result = getIconAssets('a', null)
  expect(result).toBe('a')
})
