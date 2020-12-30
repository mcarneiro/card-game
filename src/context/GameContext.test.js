import {getIconAssetBy} from './GameContext'
test('get icon assets', () => {
  const assetList = [
    {label: 'a', url: 'url-a'},
    {label: 'b', url: 'url-b'}
  ]
  const getIconAsset = getIconAssetBy(assetList)
  let icons = ['a', 'b', 'c']
  let result = icons.map(getIconAsset)

  expect(result[0].url).toBe('url-a')
  expect(result[1].url).toBe('url-b')
  expect(result[2]).toBe('c')

  result = getIconAssetBy()('a')
  expect(result).toBe('a')
})
