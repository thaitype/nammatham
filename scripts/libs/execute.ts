import { execa, Options as ExecaOptions } from 'execa';

export async function execute(process: string, args: string[], option: ExecaOptions & { dryRun?: boolean }) {
  const dryRun = option.dryRun ?? false;
  if (dryRun) {
    console.log(`[dry-run] ${process} ${args.join(' ')}`);
    return;
  }
  return execa(process, args, option).then(result => {
    console.log(result.stdout);
    return result;
  });
}
