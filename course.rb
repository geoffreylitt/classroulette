class Course < ActiveRecord::Base

  def colors
    colors_array = Array.new

    arts = {:colors => ['#2D9C90', '#238A7F'], :departments => ['ARCH','ART','CPAR','DRAM','DRST','FILM','MUSI','THST']}
    lang = {:colors => ['#883636', '#772B2B'], :departments => ['AKKD','ARBC','BNGL','CHNS','CSBK','CSBR','CSCC','CSDC','CSES','CSJE','CSMC','CSPC','CSSM','CSSY','CSTC','CSTD','CSYC','CZEC','DUTC','FREN','GMAN','GREK','HEBR','HNDI','INDN','ITAL','JAPN','KREN','LATN','MGRK','NAVY','PERS','PLSH','PORT','RUSS','SKRT','SLAV','SPAN','SPEC','SWAH','TAML','TKSH','USAF','VIET','YORU','ZULU']}
    sosc = {:colors => ['#BB7A1E', '#AD6700'], :departments => ['ACCT','ANTH','CGSC','CHLD','ECON','EDST','EGYP','ENVE','F&ES','HLTH','LING','MGT','PLSC','PSYC','SOCY','STCY']}
    hums = {:colors => ['#366488', '#294F6D'], :departments => ['AFAM','AFST','AMST','ARCG','CLCV','CLSS','EALL','EAST','ENGL','EP&E','ER&M','GLBL','GMST','HIST','HSAR','HSHM','HUMS','JDST','LAST','LITR','MMES','NELC','PHIL','RLST','RSEE','SAST','WGSS']}
    sci = {:colors => ['#368836', '#297C29'], :departments => ['AMTH','APHY','ASTR','BENG','BIOL','CENG','CHEM','CPSC','E&EB','EENG','ENAS','EVST','G&G','MATH','MB&B','MCDB','MENG','OPRS','PHYS','SCIE','STAT']}

    [arts, lang, sosc, hums, sci].each do |category|
      if category[:departments].include? self.department
        colors_array = category[:colors]
      end
    end

    if colors_array == []
      colors_array = ['#366488', '#294F6D']
    end

    colors_array
  end
end