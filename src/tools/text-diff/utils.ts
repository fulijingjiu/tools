import { diffLines, diffWords, type ChangeObject, type DiffLinesOptionsNonabortable, type DiffWordsOptionsNonabortable } from 'diff'

export type DiffMode = 'lines' | 'words'

export interface DiffPart extends ChangeObject<string> {
  key: string
}

export function computeDiff(left: string, right: string, mode: DiffMode): DiffPart[] {
  let changes: ChangeObject<string>[]
  if (mode === 'lines') {
    const options: DiffLinesOptionsNonabortable = { newlineIsToken: true }
    changes = diffLines(left, right, options)
  } else {
    const options: DiffWordsOptionsNonabortable = {}
    changes = diffWords(left, right, options)
  }
  return changes.map((change, index) => ({
    ...change,
    key: `${index}-${change.added ? 'added' : change.removed ? 'removed' : 'unchanged'}`,
  }))
}

export function getDiffExample(): { left: string; right: string } {
  return {
    left: 'apple\nbanana\ncherry\ndate',
    right: 'apple\nblueberry\ncherry\nfig',
  }
}
