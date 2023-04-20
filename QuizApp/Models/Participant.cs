using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.Models
{
    public class Participant
    {
        [Key]
        public int ParticipantId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Name { get; set; } = string.Empty;

        public byte[] PasswordHash { get; set; } = new byte[0];
        public byte[] PasswordSalt { get; set; } = new byte[0];
        public string Email { get; set; } = string.Empty;
        public int Score { get; set; } = 0;
        public int TimeTaken { get; set; } = 0;
    }
    public class ParticipantResult
    {
        public int ParticipantId { get; set; }
        public int Score { get; set; }
        public int TimeTaken { get; set; }
    }
    public class ParticipantLoginInfo
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
