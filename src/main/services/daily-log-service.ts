import fse from 'fs-extra';
import path from 'path';
import { dateFormattings, dateParsing, getCalendarMonth, getCalendarWeek } from '../../core';
import { DailyLife, defaultDailyLogCategories } from '../../core/domain';
import { GitService } from './git-service';

const gitModifiedStatus = ['modified', '*modified', 'added', '*added'];

export class DailyLogService {
  private readonly workspaceDir: string;
  private readonly gitService: GitService;

  constructor(workspaceDir: string, deps: [GitService]) {
    this.workspaceDir = workspaceDir;
    this.gitService = deps[0];
  }

  async initialize() {
    if (!(await fse.pathExists(this.workspaceDir))) {
      await fse.ensureDir(this.workspaceDir);
    }

    await this.gitService.initializeRepository(this.workspaceDir);
  }

  getDailyLogCategories() {
    // TODO: Custom category
    return defaultDailyLogCategories;
  }

  async saveDailyLife(dateStr: string, life: DailyLife) {
    const filePath = this.getDailyLifeFilePath(dateStr);

    if (!(await fse.pathExists(filePath))) {
      await fse.ensureFile(filePath);
    }

    await fse.writeJson(filePath, life, {
      spaces: 2,
    });
  }

  async getDailyLifeModifiedFlag(dateStr: string) {
    const filePath = this.getDailyLifeFilePath(dateStr);
    const status = await this.gitService.getStatus(this.workspaceDir, filePath);

    return gitModifiedStatus.includes(status);
  }

  async commitDailyFile(dateStr: string) {
    const filePath = this.getDailyLifeFilePath(dateStr);

    await this.gitService.add(this.workspaceDir, filePath);
    return await this.gitService.commit(this.workspaceDir, filePath);
  }

  async getDailyLifeByDay(dateStr: string) {
    const filePath = this.getDailyLifeFilePath(dateStr);

    try {
      const data: DailyLife = await fse.readJson(filePath, { throws: true });

      return data;
    } catch (error) {
      return null;
    }
  }

  async getDailyLifeByWeek(dateStr: string) {
    const date = this.parseDate(dateStr);
    const week = getCalendarWeek(date);
    const logs: Array<DailyLife | null> = [];

    for (const day of week.days) {
      logs.push(await this.getDailyLifeByDay(dateFormattings['yyyy-MM-dd'](day.date)));
    }

    return logs;
  }

  async getDailyLifeByMonth(dateStr: string) {
    const date = this.parseDate(dateStr);
    const month = getCalendarMonth(date);
    const logs: Array<Array<DailyLife | null>> = [];

    for (const week of month.weeks) {
      const firstDateOfWeek = week.days[0].date;
      logs.push(await this.getDailyLifeByWeek(dateFormattings['yyyy-MM-dd'](firstDateOfWeek)));
    }

    return logs;
  }

  private parseDate(dateStr: string) {
    return dateParsing['yyyy-MM-dd'](dateStr);
  }

  private getDailyLifeFilePath(dateStr: string) {
    const date = this.parseDate(dateStr);

    return path.join(
      this.workspaceDir,
      date.getFullYear().toString(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      `${date.getDate().toString().padStart(2, '0')}.json`,
    );
  }
}
