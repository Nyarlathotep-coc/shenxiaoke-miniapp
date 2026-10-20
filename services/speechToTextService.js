function mockTranscribe(options = {}) {
  const fallback = '午饭10元'
  return Promise.resolve({ text: options.mockText || fallback, source: 'voice', isMock: true, editable: true })
}

function transcribe(options = {}) {
  return mockTranscribe(options)
}

module.exports = { transcribe, mockTranscribe }
