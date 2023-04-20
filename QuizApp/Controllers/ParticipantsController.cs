using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using QuizApp.Data;
using QuizApp.Models;

namespace QuizApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly QuizDbContext _context;
        private readonly IParticipansRepository _participantsRepository;
        private readonly IConfiguration _configuration;

        public ParticipantsController(QuizDbContext context, IParticipansRepository participantsRepository, IConfiguration configuration)
        {
            _context = context;
            _participantsRepository = participantsRepository;
            _configuration = configuration;
        }

        // GET: api/Participants
        [HttpGet]
        [Route("Authenticate")]
        public async Task<ActionResult<IEnumerable<Participant>>> CheckAuthenticate()
        {
            if (_context.Participants == null)
            {
              return NotFound();
            }
            var token = Request.Cookies["token"];
            var temp =  _context.Participants.
                Where(x => x.Email == Request.Cookies["email"]).
                FirstOrDefault();
            if (token == null || temp == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        // Del: api/Participants
        [HttpDelete]
        [Route("Authenticate")]
        public async Task<ActionResult<IEnumerable<Participant>>> DeleteCookie()
        {
            if (_context.Participants == null)
            {
                return NotFound();
            }
            Response.Cookies.Delete("token");
            Response.Cookies.Delete("email");
            return Ok();
        }
        // GET: api/Participants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Participant>> GetParticipant(int id)
        {
          if (_context.Participants == null)
          {
              return NotFound();
          }
            var participant = await _context.Participants.FindAsync(id);

            if (participant == null)
            {
                return NotFound();
            }

            return participant;
        }

        // PUT: api/Participants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutParticipant(ParticipantResult _participantResult)
        {
            if (_participantResult == null)
            {
                return NotFound();
            }
            Participant participant = _context.Participants.
                Where(x => x.Email == Request.Cookies["email"]).
                FirstOrDefault();
            participant.Score = _participantResult.Score;
            participant.TimeTaken = _participantResult.TimeTaken;

            _context.Entry(participant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParticipantExists(participant.ParticipantId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // GET: api/Participants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public IActionResult SetCookie(ParticipantLoginInfo data)
        {
            var options = new CookieOptions
            {
                Expires = DateTime.Now.AddDays(1),
                SameSite = SameSiteMode.Strict,
                Secure = true,
                HttpOnly = true,
                IsEssential = true,
            };
            if (_context.Participants == null)
            {
                return NotFound();
            }
            var temp = _context.Participants.
                Where(x=> x.Email == data.Email).
                FirstOrDefault();
            if (temp != null) 
            {
                if (_participantsRepository.VerifyPasswordHash(data.Password, temp.PasswordHash, temp.PasswordSalt))
                { 
                    HttpContext.Response.Cookies.Append("token", CreateToken(temp), options);
                    HttpContext.Response.Cookies.Append("email", temp.Email, options);
                    return Ok("Login successful");
                }
                else
                {
                    return Ok("Wrong password");
                }
            }
            return Ok("");
        }

        [HttpPost]
        [Route("CreateAccount")]
        public async Task<ActionResult<Participant>> PostCreateAccount(ParticipantLoginInfo participantLogin)
        {
            bool result;
            if (_context.Participants == null)
            {
                return NotFound();
            }
            var temp = _context.Participants.
                Where(x => x.Email == participantLogin.Email).
                FirstOrDefault();
            if (temp == null)
            {
                Participant participant = new Participant();
                participant.Email = participantLogin.Email;
                participant.Name = participantLogin.Name;
                _participantsRepository.CreatePasswordHash(participantLogin.Password, out byte[] passwordHash, out byte[] passwordSalt);
                participant.PasswordHash = passwordHash;
                participant.PasswordSalt = passwordSalt;
                _context.Participants.Add(participant);
                await _context.SaveChangesAsync();
                result = true;
            }
            else
            {
                result = false;
            }
            return Ok(result);
        }
        // DELETE: api/Participants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipant(int id)
        {
            if (_context.Participants == null)
            {
                return NotFound();
            }
            var participant = await _context.Participants.FindAsync(id);
            if (participant == null)
            {
                return NotFound();
            }

            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParticipantExists(int id)
        {
            return (_context.Participants?.Any(e => e.ParticipantId == id)).GetValueOrDefault();
        }
        private string CreateToken(Participant user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.ParticipantId.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            };
            var appSettingsToken = _configuration.GetSection("AppSetting:Token").Value;
            if (appSettingsToken is null)
            {
                throw new Exception("AppSetting Token is null!");
            }
            SymmetricSecurityKey key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(appSettingsToken));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
