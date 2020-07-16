import { Component, OnInit, Inject } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/interfaces/article';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Article,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  deleteArticle() {
    this.dialogRef.close();
    this.articleService.deleteArticle(this.data.articleId).then(() => {
      this.snackBar.open('削除しました。', '閉じる', { duration: 5000 });
    });
  }
}
