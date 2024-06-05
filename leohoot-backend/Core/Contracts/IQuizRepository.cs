using Base.Core.Contracts;
using Core.Entities;

namespace Core.Contracts;

using Core.DataTransferObjects;

public interface IQuizRepository: IGenericRepository<Quiz>
{
    public Task<List<QuizDto>> GetAllQuizzes();
    public Task<QuizDto?> GetQuizDto(int quizId);
    public Task<Quiz?> GetQuiz(int quizId);
    public Task<List<QuestionDto>> GetQuestions(int quizId);
    public Task<QuestionDto?> GetQuestion(int quizId, int questionNumber);
    public Task<bool> IsAnswerCorrect(int quizId, int questionNumber, bool[] answers);
}