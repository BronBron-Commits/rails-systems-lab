class CommentsController < ApplicationController
  before_action :set_note

  def create
    @comment = @note.comments.build(comment_params)

    if @comment.save
      redirect_to @note, notice: "Comment added."
    else
      redirect_to @note, alert: "Comment failed."
    end
  end

  def destroy
    @comment = @note.comments.find(params.expect(:id))
    @comment.destroy
    redirect_to @note, notice: "Comment deleted."
  end

  private

  def set_note
    @note = Note.find(params.expect(:note_id))
  end

  def comment_params
    params.expect(comment: [:body])
  end
end
